import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { SceneFade } from './Caption';

const appear = (t: number, at: number, dur = 0.4) =>
  interpolate(t, [at, at + dur], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
const rise = (t: number, at: number, dur = 0.45) =>
  interpolate(t, [at, at + dur], [30, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

const DarkBg: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ backgroundColor: '#100D0A' }}>
    <Img src={staticFile('images/cover.png')} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', opacity: 0.18, transform: 'scale(1.08)' }} />
    <AbsoluteFill style={{ backgroundColor: 'rgba(10,8,6,0.55)' }} />
    {children}
  </AbsoluteFill>
);

// S21 这个病，人也会犯
export const EndingSceneA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sp = spring({ frame: frame - Math.round(0.7 * fps), fps, config: { damping: 12, stiffness: 120 } });

  return (
    <DarkBg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 240 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
          <div style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: 54, color: COLORS.grayOnDark, letterSpacing: 8, opacity: appear(t, 0.25) }}>
            这个病
          </div>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontWeight: 900,
              fontSize: 150,
              color: COLORS.white,
              letterSpacing: 10,
              opacity: appear(t, 0.65),
              transform: `scale(${0.82 + 0.18 * sp})`,
            }}
          >
            人也会犯
          </div>
          <div style={{ fontFamily: FONTS.kai, fontSize: 46, color: COLORS.grayOnDark, letterSpacing: 4, marginTop: 24, opacity: appear(t, 2.2), transform: `translateY(${rise(t, 2.2)}px)` }}>
            只刷真题的人，换个考场就懵
          </div>
        </div>
      </AbsoluteFill>
      <SceneFade from={0.5} />
    </DarkBg>
  );
};

// S22 留一张没见过的脸
export const EndingSceneB: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const sp = spring({ frame: frame - Math.round(1.1 * fps), fps, config: { damping: 12, stiffness: 110 } });

  return (
    <DarkBg>
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 240 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <div style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: 50, color: COLORS.grayOnDark, letterSpacing: 10, opacity: appear(t, 0.3) }}>
            得留一张
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, opacity: appear(t, 1.0, 0.3), transform: `scale(${0.8 + 0.2 * sp})` }}>
            <span style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 158, color: COLORS.gold, letterSpacing: 6 }}>没见过</span>
            <span style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 158, color: COLORS.white, letterSpacing: 6 }}>的脸</span>
          </div>
          <div style={{ fontFamily: FONTS.kai, fontSize: 46, color: COLORS.grayOnDark, letterSpacing: 6, marginTop: 26, opacity: appear(t, 3.2), transform: `translateY(${rise(t, 3.2)}px)` }}>
            时不时，考考自己
          </div>
          <div style={{ fontFamily: FONTS.serif, fontWeight: 700, fontSize: 62, color: COLORS.vermilionBright, letterSpacing: 6, marginTop: 20, opacity: appear(t, 4.6), transform: `translateY(${rise(t, 4.6)}px)` }}>
            那才叫真学会了
          </div>
        </div>
      </AbsoluteFill>
    </DarkBg>
  );
};

// 片尾卡（无配音）：印章 + 关注引导
export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const stamp = spring({ frame: frame - Math.round(0.15 * fps), fps, config: { damping: 10, stiffness: 170 } });
  const fadeOut = interpolate(t, [2.2, 2.6], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0908', justifyContent: 'center', alignItems: 'center', opacity: fadeOut }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 56 }}>
        <div
          style={{
            width: 330,
            height: 330,
            backgroundColor: COLORS.vermilion,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `rotate(-4deg) scale(${0.55 + 0.45 * stamp})`,
            boxShadow: '0 16px 60px rgba(179,58,58,0.4)',
          }}
        >
          <span style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 104, color: COLORS.white, letterSpacing: 8 }}>过拟合</span>
        </div>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: 46, color: COLORS.white, letterSpacing: 4, opacity: appear(t, 1.0) }}>
          关注我，下期讲 AI 的下一个错
        </div>
        <div style={{ fontFamily: FONTS.sans, fontWeight: 600, fontSize: 32, color: COLORS.grayOnDark, letterSpacing: 3, opacity: appear(t, 1.5) }}>
          #机器学习&nbsp;&nbsp;#过拟合&nbsp;&nbsp;#涨知识
        </div>
      </div>
    </AbsoluteFill>
  );
};
