// 生成故事水墨插画（720x1440 竖版，用于竖屏视频全幅背景）
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = '/home/z/my-project/remotion-video/public/images';
fs.mkdirSync(OUT_DIR, { recursive: true });

const STYLE = ', ancient Chinese ink wash painting with light color wash, Song dynasty genre painting aesthetic, rice paper texture, muted earthy ink tones, cinematic composition, masterpiece, high quality, detailed brushwork, no text, no words';

const IMAGES = [
  { file: 'img1.png', prompt: 'A young Chinese prodigy painter in Song dynasty robes meticulously copying a portrait painting with a fine brush at a wooden desk, stacks of finished portrait scrolls piled around him, warm candlelight, focused obsessive expression' + STYLE },
  { file: 'img2.png', prompt: 'An elderly Chinese master painter painting a portrait with bold loose expressive brush strokes, standing before a large sheet of rice paper on an easel, calm confident demeanor, sparse ink marks capturing the spirit of a face' + STYLE },
  { file: 'img3.png', prompt: 'A bustling ancient Chinese marketplace street in autumn, a curious crowd gathered around two painters, a dignified traveling scholar standing quietly among common townsfolk, morning mist, hanging shop banners' + STYLE },
  { file: 'img4.png', prompt: 'A young Chinese painter frozen mid-stroke, brush suspended in the air over a blank rice paper, stunned and helpless expression, dramatic side lighting, the vast empty paper emphasized' + STYLE },
  { file: 'img5.png', prompt: 'An elderly Chinese painter presenting a freshly finished vivid expressive portrait to an amazed crowd in an ancient marketplace, people pointing and gasping in awe, the portrait seeming alive with spirit' + STYLE },
  { file: 'img6.png', prompt: 'A young Chinese painter at night burning a huge stack of portrait paintings in a courtyard, orange firelight illuminating his resolute face, dark night background, drifting ash and glowing embers' + STYLE },
  { file: 'cover.png', prompt: 'A young ancient Chinese painter standing small and alone before an enormous towering wall covered with a thousand portrait paintings of faces, looking up, dramatic vertical composition, mysterious dim atmosphere, ink wash with subtle vermilion accent' + STYLE },
];

let ok = 0, fail = 0;
for (const { file, prompt } of IMAGES) {
  const out = path.join(OUT_DIR, file);
  if (fs.existsSync(out) && fs.statSync(out).size > 50000) {
    console.log(`[skip] ${file} already exists`);
    ok++;
    continue;
  }
  let done = false;
  for (let attempt = 1; attempt <= 3 && !done; attempt++) {
    console.log(`[gen ${attempt}] ${file} ...`);
    const res = spawnSync('z-ai', ['image', '-p', prompt, '-o', out, '-s', '768x1344'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 180000,
    });
    const okFile = fs.existsSync(out) && fs.statSync(out).size > 50000;
    if (res.status === 0 && okFile) {
      console.log(`[ok] ${file} (${(fs.statSync(out).size / 1024).toFixed(0)} KB)`);
      done = true;
      ok++;
    } else {
      console.log(`[retry] ${file} status=${res.status} size=${fs.existsSync(out) ? fs.statSync(out).size : 0}`);
      if (fs.existsSync(out)) fs.unlinkSync(out);
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
  if (!done) fail++;
}
console.log(`DONE ok=${ok} fail=${fail}`);
if (fail > 0) process.exit(1);
