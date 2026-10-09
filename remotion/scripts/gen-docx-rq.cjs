// 《第九只回家的羚羊》视频文字稿 docx 生成 —— copywriting 场景规范（无封面/单节/行距400/左对齐）
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Footer, PageNumber, AlignmentType, HeadingLevel, WidthType,
  BorderStyle, ShadingType,
} = require("docx");
const fs = require("fs");

const script = JSON.parse(fs.readFileSync("/home/z/my-project/content-redqueen/final-script.json", "utf-8"));
const tl = JSON.parse(fs.readFileSync("/home/z/my-project/content-redqueen/timeline.json", "utf-8"));

const FPS = 30;
const fmt = (frame) => {
  const s = Math.round(frame / FPS);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};
const segById = Object.fromEntries(tl.segments.map((s) => [s.id, s]));
const range = (ids) => {
  const a = segById[ids[0]], b = segById[ids[ids.length - 1]];
  return `${fmt(a.startFrame)} - ${fmt(b.startFrame + b.frames + b.gapAfter)}`;
};

// 场景配色（沿用视频深红皇后主题）
const P = {
  primary: "1A1A1A",
  body: "333333",
  secondary: "666666",
  accent: "7A1F2B",
  surface: "FDF8F4",
};

const FONT_BODY = { ascii: "Calibri", eastAsia: "Microsoft YaHei" };
const FONT_HEAD = { ascii: "Calibri", eastAsia: "SimHei" };

// 关键词高亮：正文术语加粗并着深红
const TERMS = ["红皇后效应", "Red Queen", "共演化", "生态位分化", "演化生物学", "范瓦伦", "灭绝", "相对胜率", "选择压", "爱丽丝镜中奇遇记", "军备竞赛", "拼命跑"];

function highlightRuns(text, size, color) {
  const pattern = TERMS.filter((t) => text.includes(t)).sort((a, b) => b.length - a.length);
  if (pattern.length === 0) {
    return [new TextRun({ text, size, color, font: FONT_BODY })];
  }
  const regex = new RegExp(`(${pattern.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  const parts = text.split(regex).filter((x) => x !== "");
  return parts.map(
    (part) =>
      new TextRun({
        text: part,
        size,
        color: pattern.includes(part) ? P.accent : color,
        bold: pattern.includes(part),
        font: FONT_BODY,
      })
  );
}

const bodyPara = (text) =>
  new Paragraph({
    alignment: AlignmentType.LEFT,
    indent: { firstLine: 420 },
    spacing: { before: 200, after: 200, line: 400 },
    children: highlightRuns(text, 24, P.body),
  });

const marker = (text) =>
  new Paragraph({
    spacing: { before: 60, after: 60, line: 400 },
    children: [new TextRun({ text, size: 21, color: "999999", italics: true, font: FONT_BODY })],
  });

const sectionLabel = (label, timeRange) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 120, line: 400 },
    children: [
      new TextRun({ text: `【${label}】`, bold: true, size: 28, color: P.primary, font: FONT_HEAD }),
      new TextRun({ text: `  ${timeRange}`, size: 21, color: P.secondary, font: FONT_BODY }),
    ],
  });

const h1 = (text) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 480, after: 160, line: 400 },
    children: [new TextRun({ text, bold: true, size: 28, color: P.primary, font: FONT_HEAD })],
  });

const note = (text) =>
  new Paragraph({
    spacing: { before: 100, after: 100, line: 400 },
    children: [new TextRun({ text, size: 20, color: P.secondary, font: FONT_BODY })],
  });

const groups = [
  { label: "开场钩子", ids: ["S01"], note: "语速稳，只给冲突不给答案，全程不出现任何术语" },
  { label: "故事·其一（草原与提问）", ids: ["S02", "S03"], note: "叙述腔，像说书人开场；'到底为了什么'上扬收住" },
  { label: "故事·其二（祖母的回答）", ids: ["S04", "S05"], note: "祖母的话放慢半拍；'快了十倍'落重音；年轻羚羊的兴奋要天真" },
  { label: "故事·其三（数出来的九只）", ids: ["S06", "S07"], note: "'还是九只'逐字用力；'同样快了十倍的豹'是全片第一处恍然，停一拍再收" },
  { label: "故事·其四（问山问河问风）", ids: ["S08", "S09"], note: "山、河、风三问节奏递减，营造空旷；最后一问放轻" },
  { label: "金句（祖母的话）", ids: ["S10"], note: "全片最慢的一句，'站在原地'四字逐字吐出" },
  { label: "揭晓", ids: ["S11"], note: "'红皇后效应'五字要硬，落在重音上" },
  { label: "概念·红皇后与爱丽丝", ids: ["S12"], note: "转讲解腔，语速回正常；'拼命跑，才能停在原地'稍顿" },
  { label: "概念·范瓦伦的发现", ids: ["S13"], note: "'没有关系'四字干脆；'老物种并不比新物种安全'一字一顿" },
  { label: "概念·共演化", ids: ["S14", "S15", "S16"], note: "'共演化'首次出现停半拍；'环境里最大的变量，是豹'是第二金句，压住讲" },
  { label: "出路·换一条赛道", ids: ["S17", "S18", "S19"], note: "'那怎么办'设问上扬；三个出路各自成段，'生态位分化'重读" },
  { label: "隐喻对照", ids: ["S20"], note: "跟着屏幕表格逐行读，节奏稳，不急；最后一行'红皇后假说本身'收束" },
  { label: "结尾", ids: ["S21", "S22"], note: "先放轻再收束；'有没有一棵树'轻轻落下，留白结束" },
];

const scriptChildren = [];
for (const g of groups) {
  scriptChildren.push(sectionLabel(g.label, range(g.ids)));
  if (g.note) scriptChildren.push(marker(`（${g.note}）`));
  const text = g.ids.map((id) => script.segments.find((s) => s.id === id).text).join("");
  scriptChildren.push(bodyPara(text));
}

// 隐喻对照表（红皇后版）
const mappingRows = [
  ["羚羊一代代变快", "持续演化", "每一代微小的适应被选择保留、逐代累积"],
  ["豹同步变快", "共演化军备竞赛", "猎物的适应成为捕食者的选择压，反之亦然"],
  ["永远回家九只", "不变的相对适应度", "绝对速度翻倍，相对胜率原地踏步"],
  ["快了十倍却还在原地", "红皇后假说", "灭绝概率与存续时长无关，停下等于落后"],
  ["山、河、风的沉默", "非生物环境", "气候地形几乎不变，不参赛者感受不到比赛"],
  ["祖母的三十万次日落", "化石记录", "演化以百万年计，唯长者替族群记得"],
  ["祖母角上的旧疤", "选择压的活体记录", "每个幸存者身上都写着被选择的代价"],
  ["那支下水的亲戚成了鲸", "生态位分化", "换赛道是比跑快十倍更彻底的赢法"],
  ["蜜蜂和花签的合同", "互利共生", "合作让双方都退出这场零和比赛"],
];

const cell = (text, opts = {}) =>
  new TableCell({
    width: { size: opts.w, type: WidthType.PERCENTAGE },
    margins: { top: 80, bottom: 80, left: 120, right: 120 },
    shading: opts.head ? { type: ShadingType.CLEAR, fill: "F5EFE7" } : undefined,
    children: [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        spacing: { line: 360 },
        children: [
          new TextRun({
            text,
            size: opts.head ? 22 : 21,
            bold: opts.head || opts.bold,
            color: opts.head ? P.primary : opts.bold ? P.accent : P.body,
            font: opts.head ? FONT_HEAD : FONT_BODY,
          }),
        ],
      }),
    ],
  });

const mappingTable = new Table({
  width: { size: 100, type: WidthType.PERCENTAGE },
  borders: {
    top: { style: BorderStyle.SINGLE, size: 4, color: "C9B99B" },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: "C9B99B" },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "DDDDDD" },
    insideVertical: { style: BorderStyle.NONE },
  },
  rows: [
    new TableRow({
      tableHeader: true,
      cantSplit: true,
      children: [
        cell("故事意象", { w: 30, head: true }),
        cell("演化生物学术语", { w: 24, head: true }),
        cell("说的是什么", { w: 46, head: true }),
      ],
    }),
    ...mappingRows.map(
      ([a, b, c]) =>
        new TableRow({
          cantSplit: true,
          children: [cell(a, { w: 30 }), cell(b, { w: 24, bold: true }), cell(c, { w: 46 })],
        })
    ),
  ],
});

const totalDur = tl.totalDurationSec;
const totalMin = (totalDur / 60 + 0.4).toFixed(1);

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: FONT_BODY, size: 24, color: P.body },
        paragraph: { spacing: { line: 400 } },
      },
      heading1: {
        run: { font: FONT_HEAD, size: 28, bold: true, color: P.primary },
        paragraph: { spacing: { before: 480, after: 160, line: 400 } },
      },
      heading2: {
        run: { font: FONT_HEAD, size: 28, bold: true, color: P.primary },
        paragraph: { spacing: { before: 400, after: 120, line: 400 } },
      },
    },
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, bottom: 1440, left: 1701, right: 1417 },
        },
      },
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "999999" })],
            }),
          ],
        }),
      },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 240, after: 80, line: 560, lineRule: "atLeast" },
          children: [new TextRun({ text: "《第九只回家的羚羊》", bold: true, size: 36, color: P.primary, font: FONT_HEAD })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120, line: 400 },
          children: [new TextRun({ text: "用一则草原寓言讲透演化生物学里的“红皇后效应”", size: 26, color: P.accent, font: FONT_HEAD })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 320, line: 400 },
          children: [new TextRun({ text: `竖屏短视频口播稿｜成片约 ${totalMin} 分钟｜共 ${tl.segments.length} 段配音｜语速 1.05x｜概念：红皇后效应 Red Queen Effect（演化生物学）`, size: 20, color: P.secondary, font: FONT_BODY })],
        }),

        h1("一、作品定位"),
        bodyPara("这是一支面向抖音平台的演化生物学科普短视频，用一则草原寓言完成概念讲解：羚羊一族在一百万年里快了十倍，可十只姐妹出门、天黑回家的始终是九只，因为豹也快了十倍，直到祖母说出“我们跑得越来越快，是为了还能站在原地”，故事才收口。叙事结构遵循“先藏答案、后揭晓”的原则：故事部分只出现草原、羚羊、豹、祖母这些具象意象，不出现任何术语，听众要到最后一段才隐约猜到这讲的是竞争与内卷；揭晓之后先回到《爱丽丝镜中奇遇记》的红皇后原典，再讲一九七三年范·瓦伦从化石记录里发现的恒定灭绝率，随后拆解共演化、相对适应度、非生物环境等术语，逐项对照隐喻，最后落到“生态位分化、共生合作”这两条演化自己给出的出路。视觉采用羊皮纸、深红、炭墨的博物志风格，以红白棋盘格贯穿全片，呼应“镜中棋局”的原典意象，配合逐字高亮字幕与图解动画。"),
        marker("（目标受众：对生物学、职场内卷、竞争策略有共鸣的抖音用户；完播位目标：看懂并记住“绝对进步换不来相对改善”这个判断。）"),

        h1("二、口播正文"),
        note("文中灰色斜体为配音与节奏提示，不入口播；深红加粗词为重音术语。括号内为分节与时间码，对应成片分镜。"),
        ...scriptChildren,

        h1("三、隐喻对照表"),
        new Paragraph({
          keepNext: true,
          spacing: { before: 120, after: 120, line: 400 },
          children: [new TextRun({ text: "表1 故事意象与演化生物学术语对照", bold: true, size: 21, color: P.secondary, font: FONT_BODY })],
        }),
        mappingTable,

        h1("四、视觉与制作要点"),
        bodyPara("画面构图分三段：故事部分使用博物志蚀刻风插画全幅铺底，配缓推缩放的肯伯斯镜头与底部逐字字幕，并以统一的羊皮纸调色滤镜把不同批次插画收进同一色调；揭晓与概念部分切换到羊皮纸底或深红底的图形化讲解，其中“红后与爱丽丝在滚动的棋盘上原地奔跑”是本片的核心图解，直观演出“拼命跑才能停在原地”；范瓦伦一节用对数生存直线把“灭绝概率与年龄无关”画出来，共演化一节用“羚羊×10 对撞 豹×10”的双向流动箭头呈现军备竞赛。出路部分回到插画（鲸、长颈鹿、蜜蜂与花），隐喻对照表逐行浮现，结尾金句收束后落在“红后”方印尾卡。字幕采用逐字高亮形式跟随配音进度，关键词亮金或亮红，位于避开抖音底部操作栏的安全区域。配音沿用系列沉稳女声，故事段落放慢半拍，讲解段落提速，形成张弛变化。"),

        h1("五、抖音发布方案"),
        new Paragraph({
          spacing: { before: 200, after: 80, line: 400 },
          children: [new TextRun({ text: "主标题（含话题完整版）：", bold: true, size: 24, color: P.primary, font: FONT_HEAD })],
        }),
        new Paragraph({
          spacing: { before: 80, after: 200, line: 400 },
          indent: { left: 420 },
          children: [new TextRun({ text: "跑了一百万年，谁也没赢过谁｜3分钟看懂“内卷”的生物学原型 #涨知识 #生物学 #演化论", size: 24, color: P.accent, font: FONT_BODY })],
        }),
        bodyPara("备选标题一（悬念型）：羚羊跑快了10倍，为什么回家的还是九只？#涨知识 #冷知识。备选标题二（共鸣型）：你拼命奔跑，只是为了留在原地：红皇后效应 #内卷 #职场 #研究生。备选标题三（知识型）：为什么“活得久”不会让物种更安全？红皇后效应三分钟讲明白。封面主字为“跑了100万年，谁也没赢过谁”，竖版配“3分钟看懂·内卷的生物学原型”角标与“红皇后效应·Red Queen Effect”印章信息条，另备横版封面用于长视频平台。发布时间建议工作日十二点至十三点或十八点至二十点；评论区置顶一条概念补充（红皇后效应定义、共演化与两条出路）并抛出互动问题“你现在在哪条跑道上”。"),

        h1("六、humanizer 优化记录"),
        bodyPara("寓言初稿完成后，使用开源项目 blader/humanizer（v3.1，基于维基百科 Signs of AI writing 的 26 类 AI 腔清单）对语言做了一轮系统性优化，流程上完整执行了该项目的四步工作法：标记痕迹、起草改写、自检残留问题、产出终稿。本期标记并处理的问题包括：概念解释段“环境里最大的变量从来不是气候和土地，是豹”属“不是X而是Y”句式滥用，与祖母金句形成重复，改为顺序陈述；初稿“气候在变，对手在变，猎物在变，寄生物也在变”是强迫四连排比，砍成两项；结尾“学历、新工具、加班”三组同构并列，删去中间一组只留画面感最强的加班一组；“难道奔跑没有意义？演化史自己给出了答案”属铺垫式设问加答案预告，删预告直接给结论；全文清零破折号；隐喻对照段落删除“每个角色都有对应的学名”式引导边车。终稿经人工朗读终审，按口播节奏重新切分为 22 个配音段。"),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const out = "/home/z/my-project/download/第九只回家的羚羊-视频文字稿.docx";
  fs.writeFileSync(out, buf);
  console.log("written:", out, buf.length, "bytes");
});
