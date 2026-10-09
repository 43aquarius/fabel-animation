import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { PaperBg } from './ConceptScenes';
import type { TimelineSeg } from '../timeline-data';

const appear = (t: number, at: number, dur = 0.4) =>
  interpolate(t, [at, at + dur], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

// S16 泛化能力差：训练误差 vs 测试误差 经典曲线
export const ChartScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const trainP = interpolate(t, [1.4, 6.2], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const testP = interpolate(t, [2.4, 7.4], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const lineP = appear(t, 7.6, 0.4);
  const zoneP = appear(t, 8.1, 0.6);
  const labelP = appear(t, 9.6, 0.4);
  const chipsP = appear(t, 8.0, 0.45);

  return (
    <PaperBg>
      <div style={{ position: 'absolute', top: 130, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: 38, color: COLORS.inkSoft, letterSpacing: 6, opacity: appear(t, 0.25) }}>
          机器学习管这叫
        </div>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 84, letterSpacing: 6, opacity: appear(t, 0.55) }}>
          <span style={{ color: COLORS.ink }}>泛化能力</span>
          <span style={{ color: COLORS.vermilion }}>差</span>
        </div>
      </div>

      <div style={{ position: 'absolute', top: 470, left: 70 }}>
        <svg width={940} height={680} viewBox="0 0 900 660">
          {/* 坐标轴 */}
          <line x1={90} y1={80} x2={90} y2={590} stroke={COLORS.ink} strokeWidth={4} strokeLinecap="round" opacity={appear(t, 0.9)} />
          <line x1={90} y1={590} x2={850} y2={590} stroke={COLORS.ink} strokeWidth={4} strokeLinecap="round" opacity={appear(t, 0.9)} />
          <text x={44} y={66} fontFamily={FONTS.sans} fontWeight={700} fontSize={34} fill={COLORS.inkSoft}>误差</text>
          <text x={626} y={648} fontFamily={FONTS.sans} fontWeight={700} fontSize={34} fill={COLORS.inkSoft}>训练越深入</text>

          {/* 过拟合区间（两曲线之间的差距带） */}
          <path
            d="M480,358 C600,362 700,290 850,160 L850,490 C760,478 610,436 480,382 Z"
            fill={COLORS.vermilion}
            opacity={0.1 * zoneP}
          />

          {/* 训练误差（一直下降） */}
          <path
            d="M90,170 C300,330 520,430 850,490"
            fill="none"
            stroke={COLORS.slate}
            strokeWidth={9}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - trainP}
          />
          {/* 测试误差（先降后升） */}
          <path
            d="M90,190 C240,340 370,356 480,358 C600,362 700,290 850,160"
            fill="none"
            stroke={COLORS.vermilion}
            strokeWidth={9}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - testP}
          />

          {/* 分岔虚线 */}
          <line x1={480} y1={110} x2={480} y2={590} stroke={COLORS.inkSoft} strokeWidth={3} strokeDasharray="10 10" opacity={lineP} />

          {/* 曲线端点 */}
          <circle cx={850} cy={490} r={13} fill={COLORS.slate} opacity={trainP > 0.95 ? 1 : 0} />
          <circle cx={850} cy={160} r={13} fill={COLORS.vermilion} opacity={testP > 0.95 ? 1 : 0} />

          {/* 曲线标签 */}
          <text x={640} y={540} fontFamily={FONTS.sans} fontWeight={700} fontSize={38} fill={COLORS.slate} opacity={trainP > 0.9 ? 1 : 0}>训练误差</text>
          <text x={640} y={120} fontFamily={FONTS.sans} fontWeight={700} fontSize={38} fill={COLORS.vermilion} opacity={testP > 0.9 ? 1 : 0}>测试误差</text>

          {/* 分岔标注 */}
          <g opacity={labelP}>
            <rect x={312} y={96} width={336} height={64} rx={8} fill={COLORS.ink} />
            <text x={480} y={139} textAnchor="middle" fontFamily={FONTS.sans} fontWeight={700} fontSize={34} fill={COLORS.paper}>
              过拟合，从这开始
            </text>
          </g>

          {/* 差距标注 */}
          <g opacity={labelP}>
            <path d="M700,250 L700,330 M692,322 L700,338 L708,322" stroke={COLORS.vermilion} strokeWidth={5} fill="none" strokeLinecap="round" />
            <text x={712} y={300} fontFamily={FONTS.sans} fontWeight={700} fontSize={34} fill={COLORS.vermilion}>差距</text>
          </g>
        </svg>
      </div>

      <div style={{ position: 'absolute', top: 1200, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 30, opacity: chipsP }}>
        <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 40, color: COLORS.paper, backgroundColor: COLORS.ink, padding: '14px 34px', borderRadius: 10, letterSpacing: 3 }}>
          训练集：100 分
        </div>
        <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 40, color: COLORS.white, backgroundColor: COLORS.vermilion, padding: '14px 34px', borderRadius: 10, letterSpacing: 3 }}>
          测试集：不及格
        </div>
      </div>
    </PaperBg>
  );
};
