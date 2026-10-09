// 《一千张脸》视频文字稿 docx 生成 —— copywriting 场景规范（无封面/单节/行距400/左对齐）
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, PageNumber, AlignmentType, HeadingLevel, WidthType,
  BorderStyle, ShadingType,
} = require("docx");
const fs = require("fs");

const script = JSON.parse(fs.readFileSync("/home/z/my-project/content/final-script.json", "utf-8"));
const tl = JSON.parse(fs.readFileSync("/home/z/my-project/content/timeline.json", "utf-8"));

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

// 场景配色（沿用视频朱砂主题）
const P = {
  primary: "1A1A1A",
  body: "333333",
  secondary: "666666",
  accent: "B33A3A",
  surface: "FDF8F4",
};

const FONT_BODY = { ascii: "Calibri", eastAsia: "Microsoft YaHei" };
const FONT_HEAD = { ascii: "Calibri", eastAsia: "SimHei" };

// 关键词高亮：正文术语加粗并着朱砂色
const TERMS = ["\u8FC7\u62DF\u5408", "Overfitting", "\u8BAD\u7EC3\u6570\u636E", "\u566A\u58F0", "\u89C4\u5F8B", "\u7279\u5F81", "\u6D4B\u8BD5\u6570\u636E", "\u6CDB\u5316", "\u6570\u636E\u589E\u5F3A", "\u6B63\u5219\u5316", "\u65E9\u505C", "\u4E0D\u50CF\u4EFB\u4F55\u4EBA"];
// 过拟合 Overfitting 训练数据 噪声 规律 特征 测试数据 泛化 数据增强 正则化 早停 不像任何人

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
      new TextRun({ text: `\u3010${label}\u3011`, bold: true, size: 28, color: P.primary, font: FONT_HEAD }),
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
  { label: "\u5F00\u573A\u94A9\u5B50", ids: ["S01"], note: "\u8BED\u901F\u7A33\uFF0C\u524D\u4E09\u79D2\u5168\u90E8\u7528\u6765\u5236\u9020\u60AC\u5FF5\uFF0C\u4E0D\u51FA\u73B0\u4EFB\u4F55\u6982\u5FF5\u8BCD" },
  // 开场钩子 语速稳，前三秒全部用来制造悬念，不出现任何概念词
  { label: "\u6545\u4E8B\u00B7\u5176\u4E00\uFF08\u795E\u7AE5\u6C88\u6479\uFF09", ids: ["S02", "S03"], note: "\u53D9\u8FF0\u8154\uFF0C\u50CF\u8BF4\u4E66\u4EBA\u5728\u5E18\u5B50\u540E\u9762\u8BB2\u6545\u4E8B" },
  // 故事·其一（神童沈摹） 叙述腔，像说书人在帘子后面讲故事
  { label: "\u6545\u4E8B\u00B7\u5176\u4E8C\uFF08\u8001\u753B\u50CF\u5E08\uFF09", ids: ["S04"], note: "\u201C\u6BD4\u4F8B\u4E0D\u5BF9\u201D\u8F7B\u5E26\u4E00\u70B9\u5439\u6307\u7684\u5473\u9053\uFF0C\u538B\u4F4F\u201C\u4E00\u5E74\u6BD4\u4E00\u5E74\u591A\u201D\u7684\u7591\u60D1\u8BED\u6C14" },
  // 故事·其二（老画像师）
  { label: "\u6545\u4E8B\u00B7\u5176\u4E09\uFF08\u53BF\u4EE4\u7684\u6D4B\u8BD5\uFF09", ids: ["S05", "S06"], note: "\u201C\u7ED9\u6211\u753B\u4E00\u5F20\u201D\u56DB\u4E2A\u5B57\u4E00\u5B57\u4E00\u505C\uFF1B\u6C88\u6479\u5931\u8D25\u4E00\u6BB5\u8282\u594F\u653E\u7F13\uFF0C\u7559\u51FA\u61CA\u60BC" },
  // 故事·其三（县令的测试）
  { label: "\u6545\u4E8B\u00B7\u5176\u56DB\uFF08\u4E09\u70B7\u9999\uFF09", ids: ["S07", "S08"], note: "\u201C\u4EBA\u7FA4\u70B8\u4E86\u201D\u8D77\u52BF\u8981\u9661\uFF0C\u201C\u50CF\uFF0C\u592A\u50CF\u4E86\u201D\u9010\u5B57\u7528\u529B\uFF1B\u53BF\u4EE4\u90A3\u53E5\u8BDD\u5E26\u7B11\u610F" },
  // 故事·其四（三炷香）
  { label: "\u6545\u4E8B\u00B7\u5176\u4E94\uFF08\u70E7\u753B\uFF09", ids: ["S09"], note: "\u653E\u8F7B\uFF0C\u50CF\u591C\u91CC\u81EA\u8A00\u81EA\u8BED" },
  // 故事·其五（烧画）
  { label: "\u94A5\u5319\u53E5\uFF08\u8001\u62D9\u7684\u8BDD\uFF09", ids: ["S10"], note: "\u5168\u7247\u6700\u6162\u7684\u4E00\u53E5\uFF0C\u9010\u5B57\u542D\u51FA\uFF0C\u201C\u75A6\u201D\u548C\u201C\u8138\u201D\u5404\u505C\u534A\u62CD" },
  // 钥匙句（老拙的话）
  { label: "\u63ED\u6653", ids: ["S11"], note: "\u201C\u8FC7\u62DF\u5408\u201D\u4E09\u4E2A\u5B57\u8981\u786C\uFF0C\u843D\u5728\u91CD\u97F3\u4E0A" },
  // 揭晓
  { label: "\u6982\u5FF5\u00B7\u5B9A\u4E49", ids: ["S12"], note: "\u8F6C\u5165\u8BB2\u89E3\u8154\uFF0C\u8BED\u901F\u63D0\u56DE\u6B63\u5E38" },
  // 概念·定义
  { label: "\u6982\u5FF5\u00B7\u566A\u58F0\u4E0E\u89C4\u5F8B", ids: ["S13", "S14", "S15"], note: "\u201C\u89C4\u5F8B\u201D\u201C\u566A\u58F0\u201D\u9996\u6B21\u51FA\u73B0\u65F6\u5404\u505C\u534A\u62CD\uFF0C\u7ED9\u542C\u4F17\u53CD\u5E94\u65F6\u95F4" },
  // 概念·噪声与规律
  { label: "\u6982\u5FF5\u00B7\u6CDB\u5316\u4E0E\u8BEF\u5DEE\u66F2\u7EBF", ids: ["S16"], note: "\u914D\u5408\u52A8\u6001\u56FE\u8868\uFF0C\u201C\u8BAD\u7EC3\u96C6\u4E00\u767E\u5206\uFF0C\u6D4B\u8BD5\u96C6\u4E0D\u53CA\u683C\u201D\u4E00\u6C14\u5475\u6210" },
  // 概念·泛化与误差曲线
  { label: "\u89E3\u6CD5\u00B7\u4E09\u62DB", ids: ["S17", "S18", "S19"], note: "\u4E09\u62DB\u540D\u79F0\uFF08\u6570\u636E\u589E\u5F3A/\u6B63\u5219\u5316/\u65E9\u505C\uFF09\u5404\u81EA\u91CD\u8BFB\uFF0C\u524D\u540E\u505C\u987F\u6E05\u6670" },
  // 解法·三招
  { label: "\u9690\u55BB\u5BF9\u7167", ids: ["S20"], note: "\u8DDF\u7740\u5C4F\u5E55\u8868\u683C\u9010\u884C\u8BFB\uFF0C\u8282\u594F\u7A33\u5B9A\uFF0C\u4E0D\u6025" },
  // 隐喻对照
  { label: "\u7ED3\u5C3E", ids: ["S21", "S22"], note: "\u5148\u653E\u8F7B\u518D\u6536\u675F\uFF1B\u6700\u540E\u4E00\u53E5\u201C\u90A3\u624D\u53EB\u771F\u5B66\u4F1A\u4E86\u201D\u5B57\u5B57\u843D\u5B9E" },
  // 结尾
];

const scriptChildren = [];
for (const g of groups) {
  scriptChildren.push(sectionLabel(g.label, range(g.ids)));
  if (g.note) scriptChildren.push(marker(`\uFF08${g.note}\uFF09`));
  const text = g.ids.map((id) => script.segments.find((s) => s.id === id).text).join("");
  scriptChildren.push(bodyPara(text));
}

// 隐喻对照表
const mappingRows = [
  ["\u6C88\u6479\u4E34\u7684\u4E00\u5343\u5F20\u753B\u50CF", "\u8BAD\u7EC3\u6570\u636E", "\u6A21\u578B\u7528\u6765\u5B66\u4E60\u7684\u6837\u672C"],
  ["\u75A6\u3001\u75E3\u3001\u9709\u6591", "\u566A\u58F0", "\u53EA\u5728\u4E2A\u522B\u6837\u672C\u91CC\u6210\u7ACB\u7684\u5076\u7136\u7EC6\u8282"],
  ["\u9874\u9AA8\u9AD8\u3001\u773C\u5E95\u6709\u9634\u5F71", "\u7279\u5F81\uFF08\u89C4\u5F8B\uFF09", "\u6362\u4E2A\u6837\u672C\u4F9D\u7136\u6210\u7ACB\u7684\u771F\u5B9E\u6A21\u5F0F"],
  ["\u7B2C\u4E00\u5343\u96F6\u4E00\u5F20\u8138", "\u6D4B\u8BD5\u6570\u636E", "\u7528\u6765\u68C0\u9A8C\u771F\u672C\u4E8B\u7684\u672A\u89C1\u6837\u672C"],
  ["\u6C88\u6479\u62FC\u8138\u5931\u8D25", "\u8FC7\u62DF\u5408", "\u80CC\u719F\u4E86\u566A\u58F0\uFF0C\u6CA1\u5B66\u4F1A\u89C4\u5F8B"],
  ["\u8001\u62D9\u6293\u795E\u5FD8\u5F62", "\u6CDB\u5316", "\u5728\u672A\u89C1\u8FC7\u7684\u6570\u636E\u4E0A\u4F9D\u7136\u8868\u73B0\u597D"],
  ["\u770B\u6D3B\u4EBA\u3001\u522B\u5B88\u7740\u7EB8", "\u6570\u636E\u589E\u5F3A", "\u5582\u66F4\u591A\u6837\u7684\u6837\u672C\uFF0C\u8BA9\u566A\u58F0\u96BE\u4EE5\u5F97\u901E"],
  ["\u7B14\u5934\u7C97\u4E00\u70B9\uFF0C\u7559\u5F97\u4F4F\u795E", "\u6B63\u5219\u5316", "\u7ED9\u6A21\u578B\u52A0\u7EA6\u675F\uFF0C\u522B\u8BB0\u592A\u7EC6"],
  ["\u7EC3\u5230\u8BE5\u505C\u5C31\u505C", "\u65E9\u505C", "\u8BAD\u7EC3\u5230\u5408\u9002\u7A0B\u5EA6\u5C31\u6536\u624B\uFF0C\u522B\u5237\u6EE1\u5206"],
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
        cell("\u6545\u4E8B\u610F\u8C61", { w: 30, head: true }),
        cell("\u673A\u5668\u5B66\u4E60\u672F\u8BED", { w: 22, head: true }),
        cell("\u8BF4\u7684\u662F\u4EC0\u4E48", { w: 48, head: true }),
      ],
    }),
    ...mappingRows.map(
      ([a, b, c]) =>
        new TableRow({
          cantSplit: true,
          children: [cell(a, { w: 30 }), cell(b, { w: 22, bold: true }), cell(c, { w: 48 })],
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
          children: [new TextRun({ text: "\u300A\u4E00\u5343\u5F20\u8138\u300B", bold: true, size: 36, color: P.primary, font: FONT_HEAD })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120, line: 400 },
          children: [new TextRun({ text: "\u7528\u4E00\u5219\u5BD2\u8A00\u8BB2\u900F\u673A\u5668\u5B66\u4E60\u91CC\u7684\u201C\u8FC7\u62DF\u5408\u201D", size: 26, color: P.accent, font: FONT_HEAD })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 320, line: 400 },
          children: [new TextRun({ text: `\u7AD6\u5C4F\u77ED\u89C6\u9891\u53E3\u64AD\u7A3F\uFF5C\u6210\u7247\u7EA6 ${totalMin} \u5206\u949F\uFF5C\u5171 ${tl.segments.length} \u6BB5\u914D\u97F3\uFF5C\u8BED\u901F 1.05x\uFF5C\u6982\u5FF5\uFF1A\u8FC7\u62DF\u5408 Overfitting`, size: 20, color: P.secondary, font: FONT_BODY })],
        }),

        h1("\u4E00\u3001\u4F5C\u54C1\u5B9A\u4F4D"),
        bodyPara("\u8FD9\u662F\u4E00\u652F\u9762\u5411\u6296\u97F3\u5E73\u53F0\u7684\u673A\u5668\u5B66\u4E60\u79D1\u666E\u77ED\u89C6\u9891\uFF0C\u7528\u4E00\u5219\u53E4\u98CE\u5BD2\u8A00\u5B8C\u6210\u6982\u5FF5\u8BB2\u89E3\uFF1A\u753B\u50CF\u795E\u7AE5\u6C88\u6479\u4E34\u6479\u4E86\u4E00\u5343\u5F20\u8138\uFF0C\u5374\u753B\u4E0D\u51FA\u7B2C\u4E00\u5343\u96F6\u4E00\u5F20\uFF0C\u4ECE\u800C\u5F15\u51FA\u201C\u8FC7\u62DF\u5408\u201D\u8FD9\u4E2A\u673A\u5668\u5B66\u4E60\u7ECF\u5178\u95EE\u9898\u3002\u53D9\u4E8B\u7ED3\u6784\u4E0A\u9075\u5FAA\u201C\u5148\u85CF\u7B54\u6848\u3001\u540E\u63ED\u6653\u201D\u7684\u539F\u5219\uFF1A\u6545\u4E8B\u90E8\u5206\u4E0D\u51FA\u73B0\u4EFB\u4F55\u672F\u8BED\uFF0C\u76F4\u5230\u8001\u62D9\u8BF4\u51FA\u201C\u4F60\u628A\u6BCF\u4E00\u9053\u75A6\uFF0C\u90FD\u5F53\u6210\u4E86\u8138\u201D\uFF0C\u542C\u4F17\u624D\u4F1A\u9690\u9690\u731C\u5230\u8FD9\u5728\u8BB2\u673A\u5668\u5B66\u4E60\uFF1B\u6545\u4E8B\u7ED3\u675F\u540E\u518D\u6B63\u5F0F\u63ED\u6653\u3001\u62C6\u89E3\u6982\u5FF5\u3001\u9010\u9879\u5BF9\u7167\u9690\u55BB\u3002\u89C6\u89C9\u4E0A\u91C7\u7528\u5BA3\u7EB8\u3001\u58A8\u8272\u3001\u6731\u7802\u7684\u6C34\u58A8\u77E5\u8BC6\u98CE\uFF0C\u914D\u5408\u9010\u5B57\u9AD8\u4EAE\u5B57\u5E55\u4E0E\u52A8\u6001\u56FE\u8868\uFF0C\u517C\u987E\u6296\u97F3\u7528\u6237\u7684\u9605\u8BFB\u4E60\u60EF\u4E0E\u77E5\u8BC6\u5185\u5BB9\u7684\u8D28\u611F\u3002"),
        marker("\uFF08\u76EE\u6807\u53D7\u4F17\uFF1A\u5BF9 AI\u3001\u673A\u5668\u5B66\u4E60\u3001\u5B66\u4E60\u65B9\u6CD5\u8BBA\u6709\u597D\u5947\u5FC3\u7684\u6296\u97F3\u7528\u6237\uFF1B\u5B8C\u64AD\u4F4D\u76EE\u6807\uFF1A\u770B\u61C2\u5E76\u8BB0\u4F4F\u201C\u628A\u566A\u58F0\u5F53\u89C4\u5F8B\u201D\u8FD9\u4E2A\u5224\u65AD\u3002\uFF09"),

        h1("\u4E8C\u3001\u53E3\u64AD\u6B63\u6587"),
        note("\u6587\u4E2D\u7070\u8272\u659C\u4F53\u4E3A\u914D\u97F3\u4E0E\u8282\u594F\u63D0\u793A\uFF0C\u4E0D\u5165\u53E3\u64AD\uFF1B\u6731\u7802\u8272\u52A0\u7C97\u8BCD\u4E3A\u91CD\u97F3\u672F\u8BED\u3002\u62EC\u53F7\u5185\u4E3A\u5206\u8282\u4E0E\u65F6\u95F4\u7801\uFF0C\u5BF9\u5E94\u6210\u7247\u5206\u955C\u3002"),
        ...scriptChildren,

        h1("\u4E09\u3001\u9690\u55BB\u5BF9\u7167\u8868"),
        new Paragraph({
          keepNext: true,
          spacing: { before: 120, after: 120, line: 400 },
          children: [new TextRun({ text: "\u88681 \u6545\u4E8B\u610F\u8C61\u4E0E\u673A\u5668\u5B66\u4E60\u672F\u8BED\u5BF9\u7167", bold: true, size: 21, color: P.secondary, font: FONT_BODY })],
        }),
        mappingTable,

        h1("\u56DB\u3001\u89C6\u89C9\u4E0E\u5236\u4F5C\u8981\u70B9"),
        bodyPara("\u753B\u9762\u6784\u56FE\u5206\u4E3A\u4E09\u6BB5\uFF1A\u6545\u4E8B\u90E8\u5206\u4F7F\u7528\u6C34\u58A8\u63D2\u753B\u5168\u5E45\u94FA\u5E95\uFF0C\u914D\u7F13\u63A8\u7F29\u653E\u7684\u80AF\u4F2F\u65AF\u8FD0\u955C\u5934\u4E0E\u5E95\u90E8\u5B57\u5E55\uFF1B\u63ED\u6653\u4E0E\u6982\u5FF5\u90E8\u5206\u5207\u6362\u5230\u5BA3\u7EB8\u5E95\u8272\u7684\u56FE\u5F62\u5316\u8BB2\u89E3\uFF0C\u7528\u5361\u7247\u3001\u5BF9\u6BD4\u3001\u52A8\u6001\u66F2\u7EBF\u56FE\u628A\u62BD\u8C61\u6982\u5FF5\u53EF\u89C6\u5316\uFF1B\u7ED3\u5C3E\u56DE\u5230\u6697\u8272\u6536\u675F\uFF0C\u4FDD\u6301\u53D9\u4E8B\u7684\u4F59\u97F5\u3002\u5B57\u5E55\u91C7\u7528\u9010\u5B57\u9AD8\u4EAE\u7684\u5F62\u5F0F\u8DDF\u968F\u914D\u97F3\u8FDB\u5EA6\uFF0C\u5173\u952E\u8BCD\u4EAE\u9EC4\u6216\u4EAE\u6731\u7802\u8272\uFF0C\u4F4D\u4E8E\u5B89\u5168\u533A\u57DF\uFF08\u907F\u5F00\u6296\u97F3\u5E95\u90E8\u64CD\u4F5C\u680F\uFF09\u3002\u6982\u5FF5\u6838\u5FC3\u56FE\u8868\u4E3A\u201C\u8BAD\u7EC3\u8BEF\u5DEE\u4E0B\u964D\u3001\u6D4B\u8BD5\u8BEF\u5DEE\u5148\u964D\u540E\u5347\u201D\u7684\u53CC\u66F2\u7EBF\uFF0C\u5E76\u6807\u6CE8\u5206\u5C94\u70B9\u4E0E\u5DEE\u8DDD\u5E26\uFF0C\u8BA9\u201C\u8FC7\u62DF\u5408\u4ECE\u54EA\u91CC\u5F00\u59CB\u201D\u4E00\u76EE\u4E86\u7136\u3002\u914D\u97F3\u4E3A\u6C89\u7A33\u4E13\u4E1A\u98CE\u683C\u7684\u5973\u58F0\uFF0C\u6545\u4E8B\u6BB5\u843D\u4F4E\u534A\u62CD\uFF0C\u8BB2\u89E3\u6BB5\u843D\u63D0\u901F\uFF0C\u5F62\u6210\u5F20\u5F1B\u53D8\u5316\u3002"),

        h1("\u4E94\u3001\u6296\u97F3\u53D1\u5E03\u65B9\u6848"),
        new Paragraph({
          spacing: { before: 200, after: 80, line: 400 },
          children: [new TextRun({ text: "\u4E3B\u6807\u9898\uFF08\u542B\u8BDD\u9898\u5B8C\u6574\u7248\uFF09\uFF1A", bold: true, size: 24, color: P.primary, font: FONT_HEAD })],
        }),
        new Paragraph({
          spacing: { before: 80, after: 200, line: 400 },
          indent: { left: 420 },
          children: [new TextRun({ text: "\u4ED6\u4E34\u6479\u4E861000\u5F20\u8138\uFF0C\u5374\u753B\u4E0D\u51FA\u7B2C1001\u5F20\uFF5C3\u5206\u949F\u770B\u61C2AI\u6700\u7ECF\u5178\u7684\u9519 #\u673A\u5668\u5B66\u4E60 #\u8FC7\u62DF\u5408 #\u6DA8\u77E5\u8BC6", size: 24, color: P.accent, font: FONT_BODY })],
        }),
        bodyPara("\u5907\u9009\u6807\u9898\u4E00\uFF08\u60AC\u5FF5\u5BF9\u6BD4\u578B\uFF09\uFF1A\u753B\u8C01\u50CF\u8C01\u7684\u5929\u624D\uFF0C\u4E3A\u4EC0\u4E48\u8F93\u7ED9\u4E86\u4E00\u4E2A\u201C\u753B\u5F97\u4E0D\u50CF\u201D\u7684\u8001\u5934\uFF1F\u5907\u9009\u6807\u9898\u4E8C\uFF08\u60C5\u7EEA\u5171\u9E23\u578B\uFF09\uFF1A\u80CC\u5F97\u8D8A\u719F\uFF0C\u9519\u5F97\u8D8A\u72E0\uFF1F\u8FD9\u4E2A\u75C5\uFF0CAI\u548C\u4EBA\u90FD\u4F1A\u5F97\u3002\u5C01\u9762\u4E3B\u5B57\u4E3A\u201C\u753B\u8C01\u50CF\u8C01\uFF0C\u5374\u753B\u4E0D\u51FA\u7B2C1001\u5F20\u8138\u201D\uFF0C\u642D\u914D\u89D2\u6807\u201C3\u5206\u949F\u770B\u61C2 AI \u6700\u7ECF\u5178\u7684\u9519\u201D\u4E0E\u5370\u7AE0\u5F0F\u201C\u8FC7\u62DF\u5408 \u00B7 Overfitting\u201D\u4FE1\u606F\u6761\u3002\u53D1\u5E03\u65F6\u95F4\u5EFA\u8BAE\u9009\u5DE5\u4F5C\u65E5\u4E2D\u5348\u5341\u4E8C\u70B9\u81F3\u4E00\u70B9\u6216\u665A\u4E0A\u516B\u70B9\u81F3\u5341\u70B9\uFF1B\u8BC4\u8BBA\u533A\u7F6E\u9876\u4E00\u6761\u6982\u5FF5\u8865\u5145\uFF08\u8FC7\u62DF\u5408\u7684\u5B9A\u4E49\u4E0E\u4E09\u62DB\u89E3\u6CD5\uFF09\uFF0C\u5F15\u5BFC\u8BA8\u8BBA\u3002"),

        h1("\u516D\u3001humanizer \u4F18\u5316\u8BB0\u5F55"),
        bodyPara("\u6587\u7A3F\u521D\u7A3F\u5B8C\u6210\u540E\uFF0C\u4F7F\u7528\u5F00\u6E90\u9879\u76EE blader/humanizer\uFF08v3.1\uFF0C\u57FA\u4E8E\u7EF4\u57FA\u767E\u79D1 Signs of AI writing \u7684 26 \u7C7B AI \u8154\u6E05\u5355\uFF09\u5BF9\u8BED\u8A00\u505A\u4E86\u4E00\u8F6E\u7CFB\u7EDF\u6027\u4F18\u5316\u3002\u6D41\u7A0B\u4E0A\u514B\u9686\u4E86\u8BE5\u9879\u76EE\u7684\u65B9\u6CD5\u8BBA\uFF1A\u6807\u8BB0\u75D5\u8FF9\u3001\u8D77\u8349\u6539\u5199\u3001\u81EA\u68C0\u6B8B\u7559\u95EE\u9898\u3001\u4EA7\u51FA\u7EC8\u7A3F\uFF0C\u5E76\u628A\u5B83\u7684 26 \u7C7B\u6A21\u5F0F\uFF08\u5982\u201C\u4E0D\u662FX\u800C\u662FY\u201D\u5F0F\u5BF9\u6BD4\u3001\u4E00\u53E5\u8BDD\u603B\u7ED3\u6536\u5C3E\u3001\u5F3A\u8FEB\u4E09\u8FDE\u6392\u6BD4\u3001\u7834\u6298\u53F7\u5F53\u4E07\u80FD\u8FDE\u63A5\u7B26\u3001\u4F2A\u6DF1\u523B\u63D2\u53E3\u7B49\uFF09\u4E2D\u6587\u5316\u540E\u6CE8\u5165\u5927\u6A21\u578B\u6267\u884C\u6539\u5199\u3002\u4E3B\u8981\u4FEE\u6539\u5305\u62EC\uFF1A\u5220\u53BB\u201C\u8FD9\u4E2A\u6545\u4E8B\uFF0C\u8BB2\u7684\u5176\u5B9E\u662F\u201D\u4E2D\u591A\u4F59\u7684\u94FA\u57AB\uFF1B\u628A\u201C\u8FC7\u62DF\u5408\u4E0D\u53EA\u662F\u673A\u5668\u7684\u75C5\u201D\u6539\u4E3A\u76F4\u9648\u7684\u201C\u8FD9\u4E2A\u75C5\uFF0C\u4EBA\u4E5F\u4F1A\u72AF\u201D\uFF1B\u5220\u9664\u9690\u55BB\u5BF9\u7167\u6BB5\u843D\u7684\u5F15\u5BFC\u8FB9\u8F66\uFF08\u201C\u6BCF\u4E2A\u89D2\u8272\u90FD\u6709\u51FA\u5904\u201D\uFF09\uFF1B\u780D\u6389\u533B\u751F\u6848\u4F8B\u4F7F\u7ED3\u5C3E\u4F8B\u8BC1\u4ECE\u4E24\u4E2A\u6536\u6210\u4E00\u4E2A\uFF0C\u907F\u514D\u6392\u6BD4\u4F59\u97F5\uFF1B\u5168\u6587\u7981\u7528\u7834\u6298\u53F7\u4E0E\u201C\u9996\u5148/\u5176\u6B21/\u603B\u4E4B\u201D\u5F0F\u8FC7\u6E21\u3002\u6700\u540E\u7531\u4EBA\u5DE5\u7EC8\u5BA1\u5B9A\u7A3F\uFF0C\u5E76\u6309\u53E3\u64AD\u8282\u594F\u91CD\u65B0\u5207\u5206\u4E3A 22 \u4E2A\u914D\u97F3\u6BB5\u3002"),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  const out = "/home/z/my-project/download/\u4E00\u5343\u5F20\u8138-\u89C6\u9891\u6587\u5B57\u7A3F.docx";
  fs.writeFileSync(out, buf);
  console.log("written:", out, buf.length, "bytes");
});
