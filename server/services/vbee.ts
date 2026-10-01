// VBee TTS wrapper - port from _gen_lehoi_vo.py
// Flow: POST /tts -> poll /tts/{id} until SUCCESS -> download audio

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const VBEE_APP_ID = "49f945ee-b596-42e7-aa27-2a2f281e9b85";
const VBEE_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NzI1NTAxMjB9.1iY3pGImULaJclWiR3PmNoThMEmXow0AkN_T7S9GOr0";
const VBEE_BASE = "https://vbee.vn/api/v1/tts";

// Voice codes
export const VOICES = {
  MN: "s_hochiminh_male_thiensuminhniem2_zero_shot_book_vc", // Minh Niệm 2 (primary)
  TU: "n_hn_male_ngankechuyen_ytstable_vc",
  BO: "sg_male_minhhoang_full_48k-fhg",
  TT: "s_sg_male_thientam_ytstable_vc",
  // Giọng của MC Vy (nữ Sài Gòn Tường Vy). Dùng cho mục MC Vy để giọng khớp mặt
  // người trên khung - lấy đúng mã đang chạy ở hlglive/src/config.mjs (DS_MC.vy).
  VY: "sg_female_tuongvy_call_44k-fhg",
};

const FFPROBE = String.raw`C:\Users\Dell Precision 5560\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffprobe.exe`;

export interface TTSLine {
  speaker: keyof typeof VOICES;
  text: string;
}

export interface TTSJob {
  id: string;
  slug: string;
  status: "processing" | "done" | "error";
  lines: TTSLine[];
  outputDir: string;
  error?: string;
  progress?: number;
}

const jobs = new Map<string, TTSJob>();

async function vbeeRequest(text: string, voiceCode: string): Promise<string> {
  const res = await fetch(VBEE_BASE, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${VBEE_TOKEN}`,
    },
    body: JSON.stringify({
      app_id: VBEE_APP_ID,
      input_text: text,
      voice_code: voiceCode,
      audio_type: "mp3",
      callback_url: "https://webhook.site/vbee-cb", // required but unused
    }),
  });

  if (!res.ok) throw new Error(`VBee POST failed: ${res.status}`);
  const data = (await res.json()) as any;
  const requestId = data?.result?.request_id;
  if (!requestId) throw new Error(`VBee không trả request_id (${data?.error_code ?? "?"})`);
  return requestId;
}

async function vbeePoll(requestId: string, maxWait = 120): Promise<string> {
  const start = Date.now();
  while (Date.now() - start < maxWait * 1000) {
    const res = await fetch(`${VBEE_BASE}/${requestId}`, {
      headers: { Authorization: `Bearer ${VBEE_TOKEN}`, "x-app-id": VBEE_APP_ID },
    });
    if (!res.ok) throw new Error(`VBee poll failed: ${res.status}`);
    const data = (await res.json()) as any;
    const result = data?.result ?? {};

    if (result.status === "SUCCESS") return result.audio_link;
    if (result.status === "FAILURE") throw new Error(`VBee xử lý thất bại (${requestId})`);

    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("VBee timeout");
}

async function downloadFile(url: string, dest: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

function getAudioDuration(filePath: string): number {
  try {
    const out = execSync(
      `"${FFPROBE}" -v quiet -show_entries format=duration -of csv=p=0 "${filePath}"`,
      { encoding: "utf8" }
    ).trim();
    return parseFloat(out) || 0;
  } catch {
    return 0;
  }
}

// Scene file names the NhaDamSeries template reads:
//   audio_<slug>/vo_title.mp3, vo_tip1..N.mp3, vo_outro.mp3
// Line order from the UI is: [title, ...tips, outro]
function sceneNameFor(index: number, total: number): string {
  if (index === 0) return "vo_title";
  if (index === total - 1) return "vo_outro";
  return `vo_tip${index}`;
}

function sceneKeyFor(index: number, total: number): string {
  if (index === 0) return "title";
  if (index === total - 1) return "outro";
  return `tip${index}`;
}

export async function generateTTS(slug: string, lines: TTSLine[]): Promise<string> {
  const jobId = `tts_${Date.now().toString(36)}`;
  const outputDir = path.resolve(__dirname, "../../public", `audio_${slug}`);
  fs.mkdirSync(outputDir, { recursive: true });

  const job: TTSJob = { id: jobId, slug, status: "processing", lines, outputDir, progress: 0 };
  jobs.set(jobId, job);

  // Run async
  (async () => {
    try {
      const durations: Array<{ file: string; duration: number }> = [];
      const scenes: Record<string, number> = {};

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const voiceCode = VOICES[line.speaker] || VOICES.MN;
        const fileName = `${sceneNameFor(i, lines.length)}.mp3`;
        const filePath = path.join(outputDir, fileName);

        job.progress = Math.round((i / lines.length) * 90);

        const requestId = await vbeeRequest(line.text, voiceCode);
        const audioLink = await vbeePoll(requestId);
        await downloadFile(audioLink, filePath);

        const dur = getAudioDuration(filePath);
        durations.push({ file: fileName, duration: dur });

        // Scene length = voiceover + 1.5s padding, at 30fps (pipeline rule)
        scenes[sceneKeyFor(i, lines.length)] = Math.max(60, Math.ceil((dur + 1.5) * 30));
      }

      // Scene frame counts, so the render matches the new voiceover timing
      fs.writeFileSync(path.join(outputDir, "_scenes.json"), JSON.stringify(scenes, null, 2));

      // Timeline for reference
      const timeline = durations.map((d, i) => ({
        index: i,
        file: d.file,
        duration: d.duration,
        speaker: lines[i].speaker,
        text: lines[i].text,
      }));
      fs.writeFileSync(path.join(outputDir, "_timeline.json"), JSON.stringify(timeline, null, 2));

      job.status = "done";
      job.progress = 100;
    } catch (e: any) {
      job.status = "error";
      job.error = e.message;
    }
  })();

  return jobId;
}

// Frame counts computed by the last TTS run for this slug (empty if none).
export function readScenes(slug: string): Record<string, number> | null {
  const p = path.resolve(__dirname, "../../public", `audio_${slug}`, "_scenes.json");
  if (!fs.existsSync(p)) return null;
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

export function getTTSJob(id: string): TTSJob | undefined {
  return jobs.get(id);
}
