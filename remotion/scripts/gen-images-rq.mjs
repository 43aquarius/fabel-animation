// 第二期（红皇后）插画：博物志铜版蚀刻风 + 红白棋盘格母题（768x1344 竖版）
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = '/home/z/my-project/remotion-video/public/images-rq';
fs.mkdirSync(OUT_DIR, { recursive: true });

const STYLE = ', vintage natural history illustration, antique copperplate etching style, fine cross-hatching, aged parchment background, muted sepia and ivory tones with deep crimson accents, dramatic composition, museum archive aesthetic, masterpiece, high quality, no text, no words';

const IMAGES = [
  { file: 'img1.png', prompt: 'A young antelope standing alert on a savanna at dusk, distant silhouette of a big cat among tall grass on the far horizon, dramatic low golden light, vast quiet plain' + STYLE },
  { file: 'img2.png', prompt: 'High-speed chase across an open plain, a sprinting antelope at full stretch kicking up dust, a sprinting big cat closing in right behind, intense motion, dramatic tension, dust clouds catching the light' + STYLE },
  { file: 'img3.png', prompt: 'An old antelope matriarch with a chipped scarred horn speaking to a young antelope beside her, under a vast starry night sky with a solitary acacia tree silhouette, quiet intimate mood' + STYLE },
  { file: 'img4.png', prompt: 'A tiny antelope looking up at an enormous ancient weathered mountain that dwarfs it, a river winding through the valley below, wind bending the grass, sense of immutable stillness' + STYLE },
  { file: 'img5.png', prompt: 'A young antelope standing beside an elderly scarred matriarch antelope on a small rise at dawn, the herd grazing peacefully below in golden morning light, gentle horizon glow' + STYLE },
  { file: 'img6.png', prompt: 'A natural history museum plate montage: a whale gliding through deep water in the lower scene, a giraffe stretching its neck to treetop leaves in the upper scene, a tortoise with a patterned dome shell at the side, antique specimen plate composition' + STYLE },
  { file: 'rq-cover.png', prompt: 'An antelope running at full speed across an endless giant chessboard floor of deep crimson and ivory squares stretching to the horizon, a huge dark red queen chess piece silhouette standing far away, a round mirror-like full moon in a dark sky, surreal dreamlike atmosphere' + STYLE },
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
