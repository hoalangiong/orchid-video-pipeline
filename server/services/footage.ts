// Footage folders the user dropped into public/ by hand.
//
// pickSource() only knows the 156 episodes hardcoded in nhaDamConfigs.tsx, so a
// new clips_<slug>/ folder was invisible to the app. This scans public/ for
// folders that are NOT a registered episode and reports how many scenes each
// one covers, so the browser can offer them as a footage source.
//
// Nothing else in the render path changes: the folder becomes sourceSlug, and
// renderQueue's copyAssets already copies clips_<sourceSlug>/ to the new slug.

import fs from "fs";
import path from "path";
import { getAllConfigs } from "./configLoader";

export interface FootageFolder {
  slug: string;
  useImages: boolean; // images_<slug>/*.jpg + Ken Burns instead of clips_<slug>/*.mp4
  tipCount: number; // how many tipN files are present, counted from tip1 with no gaps
  hasTitle: boolean;
  hasOutro: boolean;
  mtime: number; // newest first, so a folder just copied in lands at the top
}

const PUBLIC_DIR = path.resolve(__dirname, "../../public");

// tip3.mp4 without tip2.mp4 is unusable - the composition indexes tips from 1
// and a hole means a black scene. So stop at the first gap rather than counting
// files.
function countTips(dir: string, ext: string): number {
  let n = 0;
  while (fs.existsSync(path.join(dir, `tip${n + 1}${ext}`))) n++;
  return n;
}

export function listUserFootage(): FootageFolder[] {
  if (!fs.existsSync(PUBLIC_DIR)) return [];

  const registered = new Set(getAllConfigs().map((c) => c.slug));
  const found = new Map<string, FootageFolder>();

  for (const name of fs.readdirSync(PUBLIC_DIR)) {
    const m = name.match(/^(clips|images)_(.+)$/);
    if (!m) continue;
    const [, kind, slug] = m;
    if (registered.has(slug)) continue; // an existing episode, offered elsewhere
    // clips_auto-*/ are copies renderQueue made for a previous web render. They
    // are the newest folders on disk, so left in they would sit above the folder
    // the user actually added.
    if (slug.startsWith("auto-")) continue;

    const dir = path.join(PUBLIC_DIR, name);
    const st = fs.statSync(dir);
    if (!st.isDirectory()) continue;

    const useImages = kind === "images";
    const ext = useImages ? ".jpg" : ".mp4";
    const entry: FootageFolder = {
      slug,
      useImages,
      tipCount: countTips(dir, ext),
      hasTitle: fs.existsSync(path.join(dir, `title${ext}`)),
      hasOutro: fs.existsSync(path.join(dir, `outro${ext}`)),
      mtime: st.mtimeMs,
    };

    // A slug can have both clips_ and images_; prefer whichever covers more
    // scenes rather than whichever readdir happened to reach first.
    const prev = found.get(slug);
    if (!prev || entry.tipCount > prev.tipCount) found.set(slug, entry);
  }

  // Only folders that can actually carry a video. A render missing title or
  // outro produces black scenes, which is worse than not offering it.
  //
  // Newest first: 249 folders qualify and their names give no clue which one the
  // user just added, but the folder they copied in minutes ago is the one they
  // want, so mtime puts it at the top.
  return [...found.values()]
    .filter((f) => f.hasTitle && f.hasOutro && f.tipCount >= 1)
    .sort((a, b) => b.mtime - a.mtime);
}

export function getUserFootage(slug: string): FootageFolder | undefined {
  return listUserFootage().find((f) => f.slug === slug);
}
