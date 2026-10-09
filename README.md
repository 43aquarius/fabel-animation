# fabel-animation · 寓言看懂概念

用一则寓言讲透一个研究生水平的概念，做成适合抖音等短视频平台的科普动画。

每一话遵循同一叙事结构：**先讲故事（不出现任何术语）→ 快结束时揭晓概念 → 拆解概念本身 → 逐项对照隐喻 → 落回现实并给出出路**。观众先被故事抓住，再在"原来讲的是这个"的恍然里记住概念。

## 剧集列表

| 话数 | 标题 | 概念 | 领域 | 成片 |
|---|---|---|---|---|
| 第一话 | 《一千张脸》 | 过拟合 Overfitting | 机器学习 | `v1.0.0` Release |
| 第二话 | 《第九只回家的羚羊》 | 红皇后效应 Red Queen Effect | 演化生物学 | `v2.0.0` Release |

成品视频（1080×1920 竖屏，约 3-4 分钟）与封面图发布在本仓库的 [Releases](https://github.com/43aquarius/fabel-animation/releases)，源码与全部中间产物在本仓库内开源。

## 制作管线

```
寓言初稿（故事/揭晓/概念/隐喻对照）
  → blader/humanizer（v3.1，26 类 AI 腔模式 + 四步工作法）改写成口播稿
  → 分段 TTS 配音（22 段，ffprobe 测时长）
  → AI 插画（故事场景 + 封面主图）
  → Remotion（React 程序化视频）：时间轴生成器 + 场景组件 + 逐字高亮字幕
  → 渲染成片 → 抽帧 VLM 审查 + ASR 音画同步抽查
  → 竖屏/横屏封面（Remotion still 渲染）
  → 抖音标题与发布文案
```

文字改写记录见 `content/ep*/humanize-raw.md`（痕迹标记 / 改写稿 / 自检 / 终稿四部分）。

## 目录结构

```
remotion/          Remotion 工程（两话共用，composition 区分）
  src/             Root 注册 + 场景组件（含 redqueen/ 第二话组件族）
  public/          配音 wav 与插画（audio/ 为第一话，audio-rq/ 为第二话）
  scripts/         TTS / 插画 / 时间轴 / docx / 分块渲染脚本
content/ep01/      第一话：故事初稿、口播分段、时间轴、humanizer 记录
content/ep02/      第二话：同上
covers/            各话封面（第二话含横竖两版）
docs/              视频文字稿（docx）与抖音发布文案（txt）
```

## 本地复现

```bash
cd remotion
npm install
npx remotion render ThousandFaces out/thousand-faces.mp4   # 第一话
npx remotion render RedQueen       out/red-queen.mp4       # 第二话
npx remotion still RQCoverPortrait  out/cover-portrait.png  # 第二话竖版封面
npx remotion still RQCoverLandscape out/cover-landscape.png # 第二话横版封面
```

配音依赖 z-ai CLI（TTS / image / vision），替换为自己的音频与图片源时改 `scripts/gen-tts*.mjs` 与 `scripts/gen-images*.mjs` 即可。

## 视觉体系

- 第一话：宣纸 × 墨 × 朱砂的水墨知识风（宋代画像师寓言）
- 第二话：羊皮纸 × 深红 × 炭墨的博物志风 + 红白棋盘格母题（呼应《爱丽丝镜中奇遇记》的镜中棋局）
- 共同规范：1080×1920 竖屏 30fps；逐字高亮字幕避开底部操作栏；概念段用图形化图解（对数生存曲线、共演化对撞、隐喻对照表）；结尾落在"这个概念如何帮到你"。
