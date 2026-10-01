// Parse classify.csv + manifest.csv, expose filter/join functions.

import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

const TULIEU_DIR = path.resolve(__dirname, "../../..", "tulieu-video");

interface ClassifyRow {
  file: string;
  cat: string;
  scene: string;
  loai_lan: string;
  nguoi_nuocngoai: string;
  cay_khoemanh: string;
  chu_trong_hinh: string;
  canhbao: string;
  ghichu: string;
}

interface ManifestRow {
  taixong: string;
  cat: string;
  platform: string;
  id: string;
  uploader: string;
  title: string;
  duration_s: string;
  resolution: string;
  vcodec: string;
  tbr_kbps: string;
  size_mb: string;
  file: string;
  url: string;
}

export interface ClipInfo extends ClassifyRow {
  duration_s?: number;
  resolution?: string;
  platform?: string;
  uploader?: string;
  size_mb?: number;
}

let classifyRows: ClassifyRow[] = [];
let manifestMap: Map<string, ManifestRow> = new Map();
let loaded = false;

function load() {
  if (loaded) return;

  const classifyPath = path.join(TULIEU_DIR, "classify.csv");
  const manifestPath = path.join(TULIEU_DIR, "manifest.csv");

  if (fs.existsSync(classifyPath)) {
    const raw = fs.readFileSync(classifyPath, "utf8");
    classifyRows = parse(raw, { columns: true, skip_empty_lines: true, trim: true });
  }

  if (fs.existsSync(manifestPath)) {
    const raw = fs.readFileSync(manifestPath, "utf8");
    const rows: ManifestRow[] = parse(raw, { columns: true, skip_empty_lines: true, trim: true });
    for (const r of rows) {
      manifestMap.set(r.file, r);
    }
  }

  loaded = true;
}

export function getTopics(): Array<{ cat: string; count: number }> {
  load();
  const counts = new Map<string, number>();
  for (const r of classifyRows) {
    counts.set(r.cat, (counts.get(r.cat) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([cat, count]) => ({ cat, count }))
    .sort((a, b) => b.count - a.count);
}

export interface ClipFilter {
  cat?: string;
  scene?: string;
  loai_lan?: string;
  cay_khoemanh?: boolean;
  chu_trong_hinh?: boolean;
  nguoi_nuocngoai?: boolean;
}

export function getClips(filter: ClipFilter): ClipInfo[] {
  load();
  let results = classifyRows;

  if (filter.cat) results = results.filter((r) => r.cat === filter.cat);
  if (filter.scene) results = results.filter((r) => r.scene === filter.scene);
  if (filter.loai_lan) results = results.filter((r) => r.loai_lan.toLowerCase().includes(filter.loai_lan!.toLowerCase()));
  if (filter.cay_khoemanh !== undefined) {
    const val = filter.cay_khoemanh ? "True" : "False";
    results = results.filter((r) => r.cay_khoemanh === val);
  }
  if (filter.chu_trong_hinh !== undefined) {
    const val = filter.chu_trong_hinh ? "True" : "False";
    results = results.filter((r) => r.chu_trong_hinh === val);
  }
  if (filter.nguoi_nuocngoai !== undefined) {
    const val = filter.nguoi_nuocngoai ? "True" : "False";
    results = results.filter((r) => r.nguoi_nuocngoai === val);
  }

  return results.map((r) => {
    const m = manifestMap.get(r.file);
    return {
      ...r,
      duration_s: m ? parseFloat(m.duration_s) : undefined,
      resolution: m?.resolution,
      platform: m?.platform,
      uploader: m?.uploader,
      size_mb: m ? parseFloat(m.size_mb) : undefined,
    };
  });
}
