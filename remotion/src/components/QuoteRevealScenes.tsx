import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { SceneFade } from './Caption';

// 老拙的话（概念钥匙句）：暗场 + 楷体逐字
export const QuoteScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const line1 = '你把每一道疤';
  const line2 = '都当成了脸。';
  const renderLine = (line: string, offset: number, base: number) =>
    [...line].map((ch, i) => {
      const at = 0.35 + (offset + i) * 0.13;
      const opacity = interpolate(t, [at, at + 0.12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
      const lift = interpolate(t, [at, at + 0.18], [12, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
      const hot = ch === '疤' || ch === '脸';
      return (
        <span key={i} style={{ display: 'inline-block', opacity, transform: `translateY(${lift}px)`, color: hot ? COLORS.vermilionBright : COLORS.white }}>
          {ch}
        </span>
      );
    });

  const attrOpacity = interpolate(t, [2.6, 3.0], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <Img src={staticFile('images/img6-blur.png')} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill style={{ backgroundColor: 'rgba(8,6,4,0.58)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26 }}>
          <div style={{ fontFamily: FONTS.kai, fontWeight: 700, fontSize: 108, color: COLORS.white, letterSpacing: 10, lineHeight: 1.3 }}>
            {renderLine(line1, 0, 0)}
          </div>
          <div style={{ fontFamily: FONTS.kai, fontWeight: 700, fontSize: 108, color: COLORS.white, letterSpacing: 10, lineHeight: 1.3 }}>
            {renderLine(line2, 7, 0)}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 26, opacity: attrOpacity }}>
            <div style={{ width: 64, height: 2, backgroundColor: COLORS.grayOnDark }} />
            <div style={{ fontFamily: FONTS.serif, fontSize: 38, color: COLORS.grayOnDark, letterSpacing: 12 }}>老拙</div>
            <div style={{ width: 64, height: 2, backgroundColor: COLORS.grayOnDark }} />
          </div>
        </div>
      </AbsoluteFill>
      <SceneFade from={0.65} />
    </AbsoluteFill>
  );
};

// 揭晓：过拟合 巨字 + 印章
export const RevealScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const small1 = interpolate(t, [0.15, 0.5], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const small2 = interpolate(t, [0.55, 0.95], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const bigSpring = spring({ frame: frame - Math.round(2.55 * fps), fps, config: { damping: 12, stiffness: 130, mass: 0.9 } });
  const bigOpacity = interpolate(t, [2.5, 2.7], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const sealSpring = spring({ frame: frame - Math.round(3.0 * fps), fps, config: { damping: 10, stiffness: 200 } });
  const sealOpacity = interpolate(t, [2.95, 3.12], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const ruleW = interpolate(t, [3.3, 3.8], [0, 300], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0908', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: 44, color: COLORS.grayOnDark, letterSpacing: 10, opacity: small1 }}>
          这个故事讲的是
        </div>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 700, fontSize: 58, color: COLORS.white, letterSpacing: 8, opacity: small2 }}>
          机器学习里最经典的坑
        </div>
        <div style={{ position: 'relative', marginTop: 30 }}>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontWeight: 900,
              fontSize: 250,
              color: COLORS.white,
              letterSpacing: 24,
              lineHeight: 1,
              opacity: bigOpacity,
              transform: `scale(${0.7 + 0.3 * bigSpring})`,
              textShadow: '0 10px 60px rgba(255,255,255,0.12)',
            }}
          >
            过拟合
          </div>
          <div
            style={{
              position: 'absolute',
              right: -64,
              bottom: -4,
              width: 108,
              height: 108,
              backgroundColor: COLORS.vermilion,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `rotate(-6deg) scale(${0.5 + 0.5 * sealSpring})`,
              opacity: sealOpacity,
              boxShadow: '0 6px 24px rgba(179,58,58,0.4)',
            }}
          >
            <span style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 23, color: COLORS.white, letterSpacing: 1 }}>Overfitting</span>
          </div>
        </div>
        <div style={{ height: 4, width: ruleW, backgroundColor: COLORS.gold, marginTop: 26 }} />
      </div>
      <SceneFade from={0.8} />
    </AbsoluteFill>
  );
};
