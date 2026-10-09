import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { RQC, RQF } from '../../theme-rq';
import { SceneFade } from '../Caption';

// 揭晓：羊皮纸底 + 棋盘纹理 + 巨字"红皇后效应"
export const RevealSceneRQ: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const bigSpring = spring({ frame: frame - Math.round(0.8 * fps), fps, config: { damping: 10, stiffness: 130 } });
  const enOpacity = interpolate(t, [1.6, 2.2], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const srcOpacity = interpolate(t, [2.6, 3.3], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: RQC.parchment }}>
      {/* 淡红棋盘纹理 */}
      <AbsoluteFill
        style={{
          opacity: 0.16,
          background: 'repeating-conic-gradient(#7A1F2B 0% 25%, transparent 0% 50%)',
          backgroundSize: '260px 260px',
        }}
      />
      {/* 上下装饰细线 */}
      <div style={{ position: 'absolute', top: 130, left: 110, right: 110, height: 3, backgroundColor: RQC.crimson, opacity: 0.55 }} />
      <div style={{ position: 'absolute', bottom: 300, left: 110, right: 110, height: 3, backgroundColor: RQC.crimson, opacity: 0.55 }} />

      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ fontFamily: RQF.sans, fontWeight: 600, fontSize: 34, color: RQC.inkSoft, letterSpacing: 8, opacity: srcOpacity }}>
            演化生物学 · 出自《爱丽丝镜中奇遇记》
          </div>
          <div
            style={{
              fontFamily: RQF.serif,
              fontWeight: 900,
              fontSize: 150,
              color: RQC.ink,
              letterSpacing: 12,
              transform: `scale(${0.8 + 0.2 * bigSpring})`,
              opacity: interpolate(t, [0.7, 1.1], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
            }}
          >
            红皇后效应
          </div>
          <div
            style={{
              fontFamily: RQF.sans,
              fontWeight: 700,
              fontSize: 44,
              color: RQC.crimson,
              letterSpacing: 14,
              opacity: enOpacity,
              borderTop: `3px solid ${RQC.crimson}`,
              borderBottom: `3px solid ${RQC.crimson}`,
              padding: '10px 30px',
            }}
          >
            RED QUEEN EFFECT
          </div>
        </div>
      </AbsoluteFill>
      <SceneFade />
    </AbsoluteFill>
  );
};

// S12 概念定义：跑步机棋盘——红后与爱丽丝在原地奔跑，棋盘向后滚动
export const DefSceneRQ: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;
  const p = frame / durationInFrames;

  // 棋盘滚动：竖条纹棋盘向后移动（跑步机）
  const CELL = 150;
  const scroll = (frame * 7) % (CELL * 2);
  const bob = Math.sin(t * 9) * 14; // 奔跑起伏
  const bob2 = Math.sin(t * 9 + 2.2) * 12;

  const heroOpacity = interpolate(t, [0.2, 0.9], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const phraseOpacity = interpolate(t, [1.4, 2.0], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // 速度线（向后飞逝）
  const speedLines = [0, 1, 2, 3].map((i) => {
    const sp = ((frame * (13 + i * 4)) % 500) / 500;
    const x = interpolate(sp, [0, 1], [540 + 160, -300]);
    const y = 760 + i * 66;
    const len = 120 + i * 50;
    return { x, y, len, opacity: interpolate(sp, [0, 0.15, 0.85, 1], [0, 0.5, 0.5, 0]) };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: RQC.dark }}>
      {/* 棋盘地面（下 55%），透视由 scaleY 压缩模拟 */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: 0,
          right: 0,
          bottom: 0,
          background: `repeating-linear-gradient(90deg, ${RQC.crimson}2E 0 ${CELL}px, ${RQC.parchment}26 ${CELL}px ${CELL * 2}px)`,
          backgroundPositionX: -scroll,
          transform: 'perspective(900px) rotateX(48deg) scale(1.6)',
          transformOrigin: 'top center',
          opacity: 0.9,
        }}
      />
      {/* 地平线辉光 */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, transparent 30%, ${RQC.crimsonDeep}30 44%, transparent 52%)`,
        }}
      />

      {/* 奔跑者：红后（大）与爱丽丝（小），原地起伏 */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 560, display: 'flex', justifyContent: 'center', gap: 130, opacity: heroOpacity }}>
        {/* 红后棋子 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${bob}px)` }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 999,
              backgroundColor: RQC.crimson,
              border: `6px solid ${RQC.crimsonBright}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: RQF.serif,
              fontWeight: 900,
              fontSize: 62,
              color: RQC.white,
              boxShadow: `0 12px 40px ${RQC.crimson}66`,
            }}
          >
            后
          </div>
          <div style={{ width: 46, height: 120, backgroundColor: RQC.crimson, borderRadius: '10px 10px 26px 26px', marginTop: 6 }} />
          <div style={{ width: 150, height: 22, borderRadius: 12, backgroundColor: RQC.crimsonDeep, marginTop: 4 }} />
        </div>
        {/* 爱丽丝棋子（白） */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `translateY(${bob2}px)`, scale: '0.8' }}>
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 999,
              backgroundColor: RQC.parchment,
              border: `6px solid ${RQC.gold}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: RQF.serif,
              fontWeight: 900,
              fontSize: 52,
              color: RQC.ink,
            }}
          >
            爱
          </div>
          <div style={{ width: 46, height: 120, backgroundColor: RQC.parchmentDeep, borderRadius: '10px 10px 26px 26px', marginTop: 6 }} />
          <div style={{ width: 150, height: 22, borderRadius: 12, backgroundColor: '#B8AC90', marginTop: 4 }} />
        </div>
      </div>

      {/* 速度线 */}
      {speedLines.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            width: s.len,
            height: 6,
            borderRadius: 3,
            backgroundColor: RQC.parchment,
            opacity: s.opacity * 0.35,
          }}
        />
      ))}

      {/* 核心短语 */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 12,
          opacity: phraseOpacity,
        }}
      >
        <div style={{ fontFamily: RQF.serif, fontWeight: 700, fontSize: 58, color: RQC.white, letterSpacing: 6 }}>
          拼命地跑
        </div>
        <div style={{ fontFamily: RQF.serif, fontWeight: 900, fontSize: 74, color: RQC.crimsonBright, letterSpacing: 8 }}>
          才能停在原地
        </div>
      </div>
      <SceneFade from={0.4} />
      {/* 占位避免未使用告警 */}
      <div style={{ display: 'none' }}>{`${p}${fps}`}</div>
    </AbsoluteFill>
  );
};

// S13 范瓦伦的统计：羊皮纸 + 对数生存直线（恒定灭绝率）
export const FossilSceneRQ: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cardRise = interpolate(t, [0.2, 0.8], [30, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const cardOpacity = interpolate(t, [0.2, 0.8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const lineDraw = interpolate(t, [1.0, 2.6], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const conclusionOpacity = interpolate(t, [4.2, 5.0], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // 直线（对数坐标下恒定灭绝率 => 直线衰减）
  const x1 = 130, y1 = 120, x2 = 850, y2 = 400;

  return (
    <AbsoluteFill style={{ backgroundColor: RQC.parchment }}>
      <AbsoluteFill
        style={{
          opacity: 0.08,
          background: 'repeating-conic-gradient(#7A1F2B 0% 25%, transparent 0% 50%)',
          backgroundSize: '300px 300px',
        }}
      />
      {/* 卡片 */}
      <div
        style={{
          position: 'absolute',
          top: 190,
          left: 90,
          right: 90,
          backgroundColor: RQC.white,
          border: `3px solid ${RQC.ink}22`,
          borderRadius: 18,
          padding: '34px 40px 30px',
          opacity: cardOpacity,
          transform: `translateY(${cardRise}px)`,
          boxShadow: '0 10px 40px rgba(36,28,20,0.12)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <div style={{ fontFamily: RQF.sans, fontWeight: 700, fontSize: 34, color: RQC.ink, letterSpacing: 2 }}>
            1973 · 范·瓦伦 · 几千个物种的化石
          </div>
          <div style={{ fontFamily: RQF.sans, fontWeight: 600, fontSize: 26, color: RQC.crimson, letterSpacing: 2 }}>
            恒定灭绝率
          </div>
        </div>

        {/* SVG 曲线 */}
        <svg width="100%" height="440" viewBox="0 0 960 440" style={{ display: 'block' }}>
          {/* 坐标轴 */}
          <line x1={x1 - 20} y1={y1 - 30} x2={x1 - 20} y2={y2 + 40} stroke={RQC.ink} strokeWidth="3" opacity="0.7" />
          <line x1={x1 - 20} y1={y2 + 40} x2={x2 + 40} y2={y2 + 40} stroke={RQC.ink} strokeWidth="3" opacity="0.7" />
          {/* 网格淡线 */}
          {[y1, 200, 280, y2].map((y) => (
            <line key={y} x1={x1 - 20} y1={y} x2={x2 + 40} y2={y} stroke={RQC.ink} strokeWidth="1" opacity="0.12" />
          ))}
          {/* 衰减直线（部分绘制） */}
          <line
            x1={x1}
            y1={y1}
            x2={x1 + (x2 - x1) * lineDraw}
            y2={y1 + (y2 - y1) * lineDraw}
            stroke={RQC.crimson}
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* 数据点 */}
          {[
            [150, 132], [240, 170], [330, 208], [420, 246], [510, 284], [600, 322], [690, 360], [780, 398],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={8} fill={RQC.ink} opacity={lineDraw > (i + 1) / 9 ? 0.75 : 0} />
          ))}
          {/* 轴标注 */}
          <text x={x1 - 14} y={y1 - 40} textAnchor="start" fontSize="26" fill={RQC.inkSoft} fontFamily="'Sarasa Mono SC', sans-serif">
            还存活的属（对数）
          </text>
          <text x={x2 + 34} y={y2 + 78} textAnchor="end" fontSize="26" fill={RQC.inkSoft} fontFamily="'Sarasa Mono SC', sans-serif">
            属的生存时间 →
          </text>
          {/* 恒定斜率标注 */}
          <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 30} textAnchor="middle" fontSize="30" fill={RQC.crimson} fontWeight="700" fontFamily="'Sarasa Mono SC', sans-serif" opacity={lineDraw > 0.9 ? 0.95 : 0}>
            斜率处处相同：灭绝概率不随年龄下降
          </text>
        </svg>
      </div>

      {/* 结论大字 */}
      <div
        style={{
          position: 'absolute',
          bottom: 300,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          opacity: conclusionOpacity,
        }}
      >
        <div style={{ fontFamily: RQF.serif, fontWeight: 700, fontSize: 56, color: RQC.ink, letterSpacing: 4 }}>
          活得久，不会更安全
        </div>
        <div style={{ fontFamily: RQF.serif, fontWeight: 900, fontSize: 62, color: RQC.crimson, letterSpacing: 4 }}>
          老物种不比新物种安全
        </div>
      </div>
      <SceneFade />
    </AbsoluteFill>
  );
};

// S14 共演化对撞：羚羊×10 ↔ 豹×10，双向流动箭头
export const CoreSceneRQ: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const leftOpacity = interpolate(t, [0.2, 0.7], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const rightOpacity = interpolate(t, [0.7, 1.2], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const labelOpacity = interpolate(t, [2.2, 2.8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  // 箭头虚线流动
  const dash = (frame * 1.6) % 40;

  const pulse = 1 + Math.sin(t * 5) * 0.03;

  return (
    <AbsoluteFill style={{ backgroundColor: RQC.dark, justifyContent: 'center', alignItems: 'center' }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 46% at 50% 40%, ${RQC.crimsonDeep}40 0%, transparent 70%)`,
        }}
      />
      <div style={{ display: 'flex', alignItems: 'center', gap: 40, transform: `scale(${pulse.toFixed(3)})` }}>
        {/* 羚羊卡 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            opacity: leftOpacity,
            transform: 'translateX(-30px)',
          }}
        >
          <div
            style={{
              fontFamily: RQF.serif,
              fontWeight: 900,
              fontSize: 110,
              color: RQC.white,
              letterSpacing: 8,
              backgroundColor: 'rgba(244,235,217,0.08)',
              border: `3px solid ${RQC.parchment}55`,
              borderRadius: 22,
              padding: '30px 44px',
            }}
          >
            羚羊
          </div>
          <div style={{ fontFamily: RQF.sans, fontWeight: 700, fontSize: 72, color: RQC.gold }}>
            ×10
          </div>
        </div>

        {/* 双向箭头 */}
        <svg width="260" height="150" viewBox="0 0 260 150">
          <line x1="18" y1="75" x2="242" y2="75" stroke={RQC.crimsonBright} strokeWidth="10" strokeDasharray="26 14" strokeDashoffset={-dash} strokeLinecap="round" />
          <polygon points="242,50 242,100 216,75" fill={RQC.crimsonBright} transform="rotate(180 229 75)" />
          <polygon points="18,50 18,100 44,75" fill={RQC.crimsonBright} transform="rotate(180 31 75)" />
          <text x="130" y="132" textAnchor="middle" fontSize="30" fill={RQC.grayOnDark} fontFamily="'Sarasa Mono SC', sans-serif" opacity={labelOpacity}>
            互相吃掉对方的进步
          </text>
        </svg>

        {/* 豹卡 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
            opacity: rightOpacity,
            transform: 'translateX(30px)',
          }}
        >
          <div
            style={{
              fontFamily: RQF.serif,
              fontWeight: 900,
              fontSize: 110,
              color: RQC.crimsonBright,
              letterSpacing: 8,
              backgroundColor: `${RQC.crimson}30`,
              border: `3px solid ${RQC.crimsonBright}77`,
              borderRadius: 22,
              padding: '30px 44px',
            }}
          >
            豹
          </div>
          <div style={{ fontFamily: RQF.sans, fontWeight: 700, fontSize: 72, color: RQC.gold }}>
            ×10
          </div>
        </div>
      </div>

      {/* 术语标签 */}
      <div
        style={{
          position: 'absolute',
          bottom: 380,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: labelOpacity,
        }}
      >
        <div
          style={{
            fontFamily: RQF.sans,
            fontWeight: 700,
            fontSize: 46,
            color: RQC.parchment,
            letterSpacing: 10,
            borderTop: `3px solid ${RQC.crimsonBright}`,
            borderBottom: `3px solid ${RQC.crimsonBright}`,
            padding: '12px 40px',
          }}
        >
          共演化 · COEVOLUTION
        </div>
      </div>
      <SceneFade from={0.4} />
      {/* 占位避免未使用告警 */}
      <div style={{ display: 'none' }}>{`${fps}`}</div>
    </AbsoluteFill>
  );
};

// S15 环境里最大的变量是豹 + 绝对/相对对撞
export const VarSceneRQ: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const envOpacity = interpolate(t, [0.1, 0.6], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const leopardSpring = spring({ frame: frame - Math.round(1.2 * fps), fps, config: { damping: 8, stiffness: 140 } });
  const versusOpacity = interpolate(t, [5.6, 6.3], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const leopardPulse = 1 + Math.sin(t * 4) * 0.02;

  return (
    <AbsoluteFill style={{ backgroundColor: RQC.dark }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 40% at 50% 34%, ${RQC.crimsonDeep}55 0%, transparent 70%)`,
        }}
      />
      {/* 上：不变的"环境"三卡 */}
      <div
        style={{
          position: 'absolute',
          top: 210,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 26,
          opacity: envOpacity,
        }}
      >
        {['气候', '土地', '河流'].map((w) => (
          <div
            key={w}
            style={{
              fontFamily: RQF.serif,
              fontWeight: 600,
              fontSize: 44,
              color: RQC.grayOnDark,
              letterSpacing: 4,
              border: '2px solid rgba(203,193,169,0.35)',
              borderRadius: 14,
              padding: '14px 30px',
              backgroundColor: 'rgba(203,193,169,0.06)',
            }}
          >
            {w}
          </div>
        ))}
        <div style={{ position: 'absolute', top: 96, left: 0, right: 0, textAlign: 'center', fontFamily: RQF.sans, fontWeight: 600, fontSize: 30, color: RQC.grayOnDark, letterSpacing: 6 }}>
          一百万年都没怎么变
        </div>
      </div>

      {/* 中：巨大的豹 */}
      <div
        style={{
          position: 'absolute',
          top: 430,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          opacity: leopardSpring,
        }}
      >
        <div
          style={{
            fontFamily: RQF.serif,
            fontWeight: 900,
            fontSize: 300,
            color: RQC.crimsonBright,
            lineHeight: 1,
            letterSpacing: 10,
            transform: `scale(${(0.7 + 0.3 * leopardSpring) * leopardPulse})`,
            textShadow: `0 0 80px ${RQC.crimson}AA`,
          }}
        >
          豹
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 790,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: RQF.serif,
          fontWeight: 700,
          fontSize: 54,
          color: RQC.white,
          letterSpacing: 8,
          opacity: interpolate(t, [1.8, 2.4], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
        }}
      >
        环境里最大的变量
      </div>

      {/* 下：绝对 vs 相对 */}
      <div
        style={{
          position: 'absolute',
          bottom: 330,
          left: 80,
          right: 80,
          display: 'flex',
          justifyContent: 'center',
          gap: 36,
          opacity: versusOpacity,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ fontFamily: RQF.sans, fontWeight: 700, fontSize: 84, color: RQC.gold }}>×10</div>
          <div style={{ fontFamily: RQF.serif, fontWeight: 600, fontSize: 36, color: RQC.grayOnDark, letterSpacing: 4 }}>绝对的进步</div>
        </div>
        <div style={{ fontFamily: RQF.serif, fontWeight: 600, fontSize: 60, color: RQC.grayOnDark, alignSelf: 'flex-start', marginTop: 14 }}>对</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <div style={{ fontFamily: RQF.sans, fontWeight: 700, fontSize: 84, color: RQC.crimsonBright }}>×0</div>
          <div style={{ fontFamily: RQF.serif, fontWeight: 600, fontSize: 36, color: RQC.grayOnDark, letterSpacing: 4 }}>相对的改善</div>
        </div>
      </div>
      <SceneFade from={0.4} />
    </AbsoluteFill>
  );
};

// S16 山河风的沉默：不参赛者 + 红字警示
export const EnvSceneRQ: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  const chars = [
    { ch: '山', note: '一亿年没挪过' },
    { ch: '河', note: '只管流' },
    { ch: '风', note: '把问题吹散' },
  ];
  const warnOpacity = interpolate(t, [4.6, 5.4], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const stillness = 1 + Math.sin(t * 1.5) * 0.004; // 几乎静止

  return (
    <AbsoluteFill style={{ backgroundColor: RQC.dark, justifyContent: 'flex-start', alignItems: 'center' }}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${RQC.crimsonDeep}22 0%, transparent 40%)`,
        }}
      />
      <div style={{ marginTop: 300, display: 'flex', gap: 90, transform: `scale(${stillness})` }}>
        {chars.map((c, i) => (
          <div key={c.ch} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22, opacity: interpolate(t, [0.2 + i * 0.5, 0.9 + i * 0.5], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) }}>
            <div style={{ fontFamily: RQF.serif, fontWeight: 900, fontSize: 170, color: 'rgba(203,193,169,0.8)', lineHeight: 1 }}>{c.ch}</div>
            <div style={{ fontFamily: RQF.kai, fontSize: 32, color: 'rgba(203,193,169,0.5)', letterSpacing: 3 }}>{c.note}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 380,
          left: 70,
          right: 70,
          textAlign: 'center',
          fontFamily: RQF.serif,
          fontWeight: 700,
          fontSize: 58,
          color: RQC.white,
          letterSpacing: 4,
          lineHeight: 1.6,
          opacity: interpolate(t, [2.4, 3.1], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
        }}
      >
        它们从来不用
        <br />
        参加这场比赛
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 250,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: RQF.serif,
          fontWeight: 900,
          fontSize: 66,
          color: RQC.crimsonBright,
          letterSpacing: 6,
          opacity: warnOpacity,
          textShadow: `0 0 40px ${RQC.crimson}88`,
        }}
      >
        在比赛里，不动，就是在退步
      </div>
      <SceneFade from={0.4} />
    </AbsoluteFill>
  );
};
