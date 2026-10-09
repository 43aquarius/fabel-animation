import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS } from '../theme';

const appear = (t: number, at: number, dur = 0.4) =>
  interpolate(t, [at, at + dur], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
const rise = (t: number, at: number, dur = 0.45) =>
  interpolate(t, [at, at + dur], [30, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

export const PaperBg: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: COLORS.paper }}>
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(180deg, rgba(215,202,170,0.55) 0%, rgba(215,202,170,0) 10%, rgba(215,202,170,0) 90%, rgba(215,202,170,0.55) 100%)',
      }}
    />
    {children}
  </AbsoluteFill>
);

const Header: React.FC<{ children: React.ReactNode; top?: number }> = ({ children, top = 150 }) => (
  <div
    style={{
      position: 'absolute',
      top,
      left: 0,
      right: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'baseline',
      gap: 16,
    }}
  >
    {children}
  </div>
);

// S12 定义：训练集完美 vs 新数据露馅
export const DefScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const card = (opts: { at: number; label: string; big: string; chip: string; accent: string }) => {
    const sp = spring({ frame: frame - Math.round(opts.at * fps), fps, config: { damping: 13, stiffness: 120 } });
    return (
      <div
        style={{
          width: 430,
          padding: '44px 30px',
          backgroundColor: '#FDFAF2',
          border: `3px solid ${opts.accent}`,
          borderRadius: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 22,
          opacity: appear(t, opts.at),
          transform: `translateY(${rise(t, opts.at)}px) scale(${0.92 + 0.08 * sp})`,
          boxShadow: '0 10px 34px rgba(34,29,23,0.10)',
        }}
      >
        <div style={{ fontFamily: FONTS.serif, fontSize: 34, color: COLORS.inkSoft, letterSpacing: 4 }}>{opts.label}</div>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 78, color: opts.accent, letterSpacing: 6 }}>{opts.big}</div>
        <div
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 700,
            fontSize: 32,
            color: opts.accent === COLORS.ink ? COLORS.paper : COLORS.white,
            backgroundColor: opts.accent,
            padding: '8px 26px',
            borderRadius: 6,
            letterSpacing: 4,
          }}
        >
          {opts.chip}
        </div>
      </div>
    );
  };

  return (
    <PaperBg>
      <Header>
        <span style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 72, color: COLORS.ink, letterSpacing: 6, opacity: appear(t, 0.25) }}>
          什么叫过拟合？
        </span>
      </Header>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 300 }}>
        <div style={{ display: 'flex', gap: 36 }}>
          {card({ at: 1.2, label: '在训练数据上', big: '表现完美', chip: '100 分', accent: COLORS.ink })}
          {card({ at: 3.2, label: '一换没见过的数据', big: '就露馅了', chip: '不及格', accent: COLORS.vermilion })}
        </div>
      </AbsoluteFill>
    </PaperBg>
  );
};

// S13 训练数据 = 一千张画
export const NoiseSceneA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const cells = Array.from({ length: 12 });
  const chips = [
    { label: '疤', at: 3.1, cell: 1 },
    { label: '痣', at: 3.8, cell: 6 },
    { label: '霉斑', at: 4.5, cell: 10 },
  ];

  return (
    <PaperBg>
      <Header>
        <span style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 68, color: COLORS.ink, letterSpacing: 4 }}>那一千张画</span>
        <span
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 700,
            fontSize: 34,
            color: COLORS.white,
            backgroundColor: COLORS.vermilion,
            padding: '6px 20px',
            borderRadius: 6,
            opacity: appear(t, 0.9),
            transform: `translateY(${rise(t, 0.9)}px)`,
          }}
        >
          = 训练数据
        </span>
      </Header>

      <div style={{ position: 'absolute', top: 400, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 190px)', gap: 26 }}>
          {cells.map((_, i) => {
            const at = 1.1 + i * 0.07;
            return (
              <div
                key={i}
                style={{
                  height: 190,
                  backgroundColor: 'rgba(253,250,242,0.9)',
                  border: `2.5px solid rgba(34,29,23,${0.16 + (i % 3) * 0.06})`,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: appear(t, at, 0.3),
                  transform: `scale(${interpolate(t, [at, at + 0.3], [0.85, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' })})`,
                }}
              >
                <div style={{ fontFamily: FONTS.kai, fontSize: 84, color: 'rgba(34,29,23,0.14)' }}>面</div>
              </div>
            );
          })}
        </div>
      </div>

      {chips.map((c, ci) => {
        const sp = spring({ frame: frame - Math.round(c.at * fps), fps, config: { damping: 10, stiffness: 180 } });
        const col = c.cell % 4;
        const row = Math.floor(c.cell / 4);
        const left = (1080 - (4 * 190 + 3 * 26)) / 2 + col * (190 + 26) + 95;
        const top = 400 + row * (190 + 26) + 95;
        return (
          <div
            key={ci}
            style={{
              position: 'absolute',
              left: left - 52,
              top: top - 52,
              width: 104,
              height: 104,
              borderRadius: 999,
              backgroundColor: COLORS.vermilion,
              border: `5px solid ${COLORS.paper}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${0.4 + 0.6 * sp}) rotate(${interpolate(sp, [0, 1], [-30, -8])}deg)`,
              boxShadow: '0 8px 22px rgba(179,58,58,0.35)',
            }}
          >
            <span style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: c.label.length > 1 ? 34 : 48, color: COLORS.white }}>{c.label}</span>
          </div>
        );
      })}

      <div style={{ position: 'absolute', top: 1210, left: 90, right: 90, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 700, fontSize: 52, color: COLORS.vermilion, letterSpacing: 4, opacity: appear(t, 5.4), transform: `translateY(${rise(t, 5.4)}px)` }}>
          记住了：疤、痣、霉斑
        </div>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 52, color: COLORS.ink, letterSpacing: 4, opacity: appear(t, 6.6), transform: `translateY(${rise(t, 6.6)}px)` }}>
          没记住：人脸的规律
        </div>
      </div>
    </PaperBg>
  );
};

// S14 规律 vs 噪声
export const NoiseSceneB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const row = (opts: { at: number; title: string; titleColor: string; example: string; foot: string; mark: 'ok' | 'bad' }) => {
    const sp = spring({ frame: frame - Math.round(opts.at * fps), fps, config: { damping: 14, stiffness: 110 } });
    return (
      <div
        style={{
          width: 900,
          padding: '38px 46px',
          backgroundColor: '#FDFAF2',
          border: `3px solid ${opts.titleColor}`,
          borderRadius: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          opacity: appear(t, opts.at),
          transform: `translateY(${rise(t, opts.at)}px) scale(${0.94 + 0.06 * sp})`,
          boxShadow: '0 10px 34px rgba(34,29,23,0.10)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
          <div
            style={{
              width: 92,
              height: 92,
              borderRadius: 8,
              backgroundColor: opts.titleColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: FONTS.serif,
              fontWeight: 900,
              fontSize: 56,
              color: COLORS.white,
            }}
          >
            {opts.title.slice(-1)}
          </div>
          <div style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 66, color: opts.titleColor, letterSpacing: 8 }}>{opts.title}</div>
          <svg width="44" height="44" viewBox="0 0 44 44" style={{ marginLeft: 'auto' }}>
            {opts.mark === 'ok' ? (
              <path d="M8 24 L18 34 L37 12" stroke={COLORS.ink} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M10 10 L34 34 M34 10 L10 34" stroke={COLORS.vermilion} strokeWidth="6" fill="none" strokeLinecap="round" />
            )}
          </svg>
        </div>
        <div style={{ fontFamily: FONTS.kai, fontSize: 46, color: COLORS.ink, letterSpacing: 2 }}>例：{opts.example}</div>
        <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 36, color: COLORS.inkSoft, letterSpacing: 2 }}>{opts.foot}</div>
      </div>
    );
  };

  return (
    <PaperBg>
      <Header>
        <span style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 64, color: COLORS.ink, letterSpacing: 4, opacity: appear(t, 0.25) }}>
          细节里，混着两类东西
        </span>
      </Header>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 260 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
          {row({ at: 1.6, title: '规律', titleColor: COLORS.ink, example: '颧骨高，眼底下有阴影', foot: '换个地方，还成立', mark: 'ok' })}
          {row({ at: 5.6, title: '噪声', titleColor: COLORS.vermilion, example: '这张纸，恰好破了个角', foot: '只在那一张纸上成立', mark: 'bad' })}
        </div>
      </AbsoluteFill>
    </PaperBg>
  );
};

// S15 把噪声当成了规律
export const NoiseSceneC: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const word = (txt: string, at: number, color: string, size: number) => {
    const sp = spring({ frame: frame - Math.round(at * fps), fps, config: { damping: 12, stiffness: 130 } });
    return (
      <span
        style={{
          fontFamily: FONTS.serif,
          fontWeight: 900,
          fontSize: size,
          color,
          letterSpacing: 6,
          display: 'inline-block',
          opacity: appear(t, at, 0.25),
          transform: `scale(${0.7 + 0.3 * sp})`,
        }}
      >
        {txt}
      </span>
    );
  };

  const arrowP = interpolate(t, [1.7, 2.4], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <PaperBg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 320 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
          <div style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: 46, color: COLORS.inkSoft, letterSpacing: 6, opacity: appear(t, 0.25) }}>
            过拟合，就是
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 34 }}>
            {word('把', 0.7, COLORS.inkSoft, 46)}
            {word('噪声', 1.1, COLORS.vermilion, 132)}
            <svg width="120" height="70" viewBox="0 0 120 70">
              <path d="M6 35 C 40 5, 80 5, 108 30" stroke={COLORS.ink} strokeWidth="6" fill="none" strokeLinecap="round" strokeDasharray="160" strokeDashoffset={160 * (1 - arrowP)} />
              <path d="M96 22 L114 33 L98 44" stroke={COLORS.ink} strokeWidth="6" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={arrowP} />
            </svg>
            {word('当成', 2.6, COLORS.inkSoft, 46)}
            {word('规律', 3.1, COLORS.ink, 132)}
          </div>
          <div style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 44, color: COLORS.inkSoft, letterSpacing: 6, marginTop: 20, opacity: appear(t, 4.3), transform: `translateY(${rise(t, 4.3)}px)` }}>
            一股脑，全背下来
          </div>
          <div style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 62, marginTop: 34, opacity: appear(t, 5.6), transform: `translateY(${rise(t, 5.6)}px)` }}>
            <span style={{ color: COLORS.ink }}>背得越死</span>
            <span style={{ color: COLORS.inkSoft }}>，</span>
            <span style={{ color: COLORS.vermilion }}>错得越离谱</span>
          </div>
        </div>
      </AbsoluteFill>
    </PaperBg>
  );
};
