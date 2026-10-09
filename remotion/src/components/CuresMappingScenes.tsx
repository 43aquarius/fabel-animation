import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { PaperBg } from './ConceptScenes';
import type { TimelineSeg } from '../timeline-data';

const appear = (t: number, at: number, dur = 0.4) =>
  interpolate(t, [at, at + dur], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
const rise = (t: number, at: number, dur = 0.45) =>
  interpolate(t, [at, at + dur], [34, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

// S17-S19 三招治疗：卡片逐张进场，前一招常驻微暗
const CURES = [
  { n: '一', term: '数据增强', plain: '多喂不一样的脸', tie: '老拙让沈摹去看活人' },
  { n: '二', term: '正则化', plain: '别记太细，抓大放小', tie: '笔头粗一点，留得住神' },
  { n: '三', term: '早停', plain: '练到该停就停', tie: '别把训练分刷到满分' },
];

export const CuresScene: React.FC<{ seg: TimelineSeg }> = ({ seg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const activeCount = seg.id === 'S17' ? 1 : seg.id === 'S18' ? 2 : 3;

  return (
    <PaperBg>
      <div style={{ position: 'absolute', top: 140, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 92, color: COLORS.ink, letterSpacing: 10, opacity: appear(t, 0.2) }}>
          怎么治？
        </div>
        <div style={{ fontFamily: FONTS.kai, fontSize: 40, color: COLORS.inkSoft, letterSpacing: 6, opacity: appear(t, 0.6) }}>
          老拙早就给出了答案
        </div>
      </div>

      <div style={{ position: 'absolute', top: 470, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 42 }}>
        {CURES.map((c, i) => {
          const isEntering = i === activeCount - 1;
          const at = isEntering ? 0.5 : -1;
          const sp = spring({ frame: frame - Math.round(Math.max(at, 0) * fps), fps, config: { damping: 13, stiffness: 120 } });
          const dim = i < activeCount - 1 ? 0.55 : 1;
          const shown = i < activeCount;
          if (!shown) return null;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 30,
                padding: '30px 36px',
                backgroundColor: '#FDFAF2',
                border: `${isEntering ? 3 : 2}px solid ${isEntering ? COLORS.vermilion : 'rgba(34,29,23,0.18)'}`,
                borderRadius: 14,
                opacity: isEntering ? appear(t, at) * dim : dim,
                transform: isEntering ? `translateY(${rise(t, at)}px) scale(${0.93 + 0.07 * sp})` : 'none',
                boxShadow: isEntering ? '0 12px 36px rgba(179,58,58,0.16)' : 'none',
              }}
            >
              <div
                style={{
                  minWidth: 96,
                  height: 96,
                  borderRadius: 10,
                  backgroundColor: COLORS.vermilion,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: FONTS.serif,
                  fontWeight: 900,
                  fontSize: 54,
                  color: COLORS.white,
                }}
              >
                {c.n}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 62, color: COLORS.ink, letterSpacing: 4 }}>{c.term}</div>
                <div style={{ fontFamily: FONTS.kai, fontSize: 42, color: COLORS.inkSoft, letterSpacing: 2 }}>{c.plain}</div>
              </div>
              <div style={{ marginLeft: 'auto', maxWidth: 250, textAlign: 'right' }}>
                <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 27, color: 'rgba(87,80,63,0.8)', lineHeight: 1.5 }}>
                  「{c.tie}」
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </PaperBg>
  );
};

// S20 隐喻对照表
const MAPPING_ROWS: [string, string, string][] = [
  ['沈摹的一千张画像', '训练数据', '训练数据'],
  ['疤、痣、霉斑', '噪声', '是噪声'],
  ['颧骨和阴影', '特征·规律', '是特征'],
  ['第 1001 张脸', '测试数据', '测试数据'],
  ['沈摹拼脸失败', '过拟合', '是过拟合'],
  ['老拙抓神忘形', '泛化', '会泛化'],
];

export const MappingScene: React.FC<{ seg: TimelineSeg }> = ({ seg }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  // 用配音的逐字时间定位每行出现的时机
  const rowAt = MAPPING_ROWS.map(([, , probe]) => {
    const idx = seg.text.indexOf(probe);
    return idx >= 0 ? Math.max(0.1, seg.charStarts[idx] - 0.5) : 0.5;
  });

  return (
    <PaperBg>
      <div style={{ position: 'absolute', top: 135, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 72, color: COLORS.ink, letterSpacing: 6, opacity: appear(t, 0.2) }}>
          把故事翻译成机器学习
        </div>
        <div style={{ fontFamily: FONTS.kai, fontSize: 36, color: COLORS.inkSoft, letterSpacing: 4, opacity: appear(t, 0.55) }}>
          每一个隐喻，都有名字
        </div>
      </div>

      <div style={{ position: 'absolute', top: 400, left: 55, right: 55, display: 'flex', flexDirection: 'column', gap: 26 }}>
        {MAPPING_ROWS.map(([story, term], i) => {
          const at = rowAt[i];
          const sp = spring({ frame: frame - Math.round(at * fps), fps, config: { damping: 14, stiffness: 130 } });
          const slideX = interpolate(sp, [0, 1], [40, 0]);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 20, opacity: appear(t, at, 0.3), transform: `translateX(${slideX}px)` }}>
              <div
                style={{
                  flex: 1,
                  padding: '24px 28px',
                  backgroundColor: '#FDFAF2',
                  border: '2.5px solid rgba(34,29,23,0.22)',
                  borderRadius: 10,
                  textAlign: 'right',
                  fontFamily: FONTS.serif,
                  fontWeight: 700,
                  fontSize: 44,
                  color: COLORS.ink,
                  letterSpacing: 2,
                }}
              >
                {story}
              </div>
              <svg width={72} height={30} viewBox="0 0 72 30">
                <path d="M4 15 L54 15 M44 6 L58 15 L44 24" stroke={COLORS.inkSoft} strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div
                style={{
                  flex: 1,
                  padding: '24px 28px',
                  backgroundColor: '#FBEDED',
                  border: `3px solid ${COLORS.vermilion}`,
                  borderRadius: 10,
                  fontFamily: FONTS.serif,
                  fontWeight: 900,
                  fontSize: 48,
                  color: COLORS.vermilion,
                  letterSpacing: 2,
                }}
              >
                {term}
              </div>
            </div>
          );
        })}
      </div>
    </PaperBg>
  );
};
