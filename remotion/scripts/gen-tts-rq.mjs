// 第二期（红皇后）分段旁白配音（z-ai tts CLI），ffprobe 测时长，输出 timeline.json
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SCRIPT = JSON.parse(fs.readFileSync('/home/z/my-project/content-redqueen/final-script.json', 'utf-8'));
const OUT_DIR = '/home/z/my-project/remotion-video/public/audio-rq';
fs.mkdirSync(OUT_DIR, { recursive: true });

const probeDuration = (file) => {
  const res = spawnSync('ffprobe', ['-v', 'quiet', '-show_entries', 'format=duration', '-of', 'csv=p=0', file], { encoding: 'utf-8' });
  const d = parseFloat(res.stdout && res.stdout.trim());
  return isNaN(d) ? null : d;
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const timeline = [];
let totalChars = 0;
let totalDur = 0;
let fail = 0;

for (const seg of SCRIPT.segments) {
  const out = path.join(OUT_DIR, `${seg.id}.wav`);
  totalChars += seg.text.length;
  let dur = fs.existsSync(out) ? probeDuration(out) : null;

  if (dur === null || dur < 0.3) {
    let done = false;
    for (let attempt = 1; attempt <= 4 && !done; attempt++) {
      console.log(`[tts ${attempt}] ${seg.id} (${seg.text.length} chars) ...`);
      const res = spawnSync('z-ai', ['tts', '-i', seg.text, '-o', out, '--voice', SCRIPT.voice, '--speed', String(SCRIPT.speed), '--format', 'wav'], {
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 120000,
      });
      dur = fs.existsSync(out) ? probeDuration(out) : null;
      if (res.status === 0 && dur !== null && dur > 0.3) {
        done = true;
      } else {
        console.log(`[retry] ${seg.id} status=${res.status} dur=${dur}`);
        await sleep(2500 * attempt); // 429 限流：指数冷却
      }
    }
    if (!done) { fail++; console.error(`[FAIL] ${seg.id}`); }
  }

  if (dur !== null && dur > 0.3) {
    timeline.push({ ...seg, audio: `audio-rq/${seg.id}.wav`, duration: Math.round(dur * 1000) / 1000 });
    totalDur += dur;
    console.log(`[ok] ${seg.id} ${dur.toFixed(2)}s`);
  }
  await sleep(300); // 段间小间隔，规避限流
}

fs.writeFileSync('/home/z/my-project/content-redqueen/timeline.json', JSON.stringify({
  voice: SCRIPT.voice,
  speed: SCRIPT.speed,
  totalChars,
  totalDurationSec: Math.round(totalDur * 100) / 100,
  segments: timeline,
}, null, 2));

console.log(`\nSUMMARY: ${timeline.length}/${SCRIPT.segments.length} segments, ${totalChars} chars, total audio ${totalDur.toFixed(1)}s (~${(totalDur / 60).toFixed(2)} min)`);
if (fail > 0 || timeline.length !== SCRIPT.segments.length) process.exit(1);
