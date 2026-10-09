// 第二期视觉主题：羊皮纸 × 深红皇后 × 炭墨（博物志风，与第一期水墨朱砂同为"古典知识"家族）
export const RQC = {
  crimson: '#7A1F2B',       // 深红皇后
  crimsonDeep: '#521522',   // 更深红
  crimsonBright: '#D24A58', // 亮红（深底强调）
  parchment: '#F4EBD9',     // 羊皮纸
  parchmentDeep: '#EADFC6',
  ink: '#241C14',           // 炭墨
  inkSoft: '#5C5040',
  gold: '#C9962E',          // 铜金
  white: '#FFFFFF',
  grayOnDark: '#CBC1A9',
  dark: '#171114',
};

export const RQF = {
  serif: "'Noto Serif SC', 'Songti SC', serif",
  sans: "'Sarasa Mono SC', 'Noto Sans SC', sans-serif",
  kai: "'LXGW WenKai', 'Kaiti SC', serif",
};

// 故事插画统一调色：把不同批次生成的图统一到羊皮纸暖调（风格一致性的工程保障）
export const RQ_IMG_FILTER = 'sepia(0.22) saturate(1.05) contrast(1.05) brightness(0.97)';
