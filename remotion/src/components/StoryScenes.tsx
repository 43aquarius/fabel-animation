import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { COLORS, FONTS } from '../theme';
import { SceneFade } from './Caption';

// 开场钩子：大字排版 + 数字冲击
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;

  const appear = (at: number) =>
    interpolate(t, [at, at + 0.35], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const rise = (at: number) =>
    interpolate(t, [at, at + 0.4], [26, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  const punchSpring = spring({ frame: frame - Math.round(6.2 * fps), fps, config: { damping: 9, stiffness: 160 } });
  const punchOpacity = interpolate(t, [6.15, 6.45], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  const kb = frame / durationInFrames;
  const scale = interpolate(kb, [0, 1], [1.08, 1.15]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <Img
        src={staticFile('images/img1.png')}
        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }}
      />
      <AbsoluteFill style={{ backgroundColor: 'rgba(10,8,6,0.62)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 96, paddingRight: 70 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, opacity: appear(0.25), transform: `translateY(${rise(0.25)}px)` }}>
            <span style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: 52, color: COLORS.grayOnDark }}>他临摹了</span>
            <span style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 168, color: COLORS.gold, lineHeight: 1 }}>1000</span>
            <span style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: 52, color: COLORS.grayOnDark }}>张脸</span>
          </div>
          <div style={{ fontFamily: FONTS.serif, fontWeight: 700, fontSize: 62, color: COLORS.white, letterSpacing: 6, opacity: appear(2.1), transform: `translateY(${rise(2.1)}px)` }}>
            张张分毫不差
          </div>
          <div style={{ fontFamily: FONTS.serif, fontWeight: 600, fontSize: 50, color: 'rgba(237,230,214,0.85)', letterSpacing: 4, marginTop: 26, opacity: appear(3.7), transform: `translateY(${rise(3.7)}px)` }}>
            可第 1001 张脸出现时
          </div>
          <div
            style={{
              fontFamily: FONTS.serif,
              fontWeight: 900,
              fontSize: 108,
              color: COLORS.vermilionBright,
              letterSpacing: 8,
              marginTop: 14,
              opacity: punchOpacity,
              transform: `scale(${0.82 + 0.18 * punchSpring}) translateY(${rise(6.2)}px)`,
              textShadow: '0 4px 30px rgba(184,58,58,0.35)',
            }}
          >
            笔，落不下去了
          </div>
        </div>
      </AbsoluteFill>
      <SceneFade />
    </AbsoluteFill>
  );
};

// 故事场景：插画 + Ken Burns + 底部字幕（字幕由 Main 按段驱动）
export const StoryScene: React.FC<{ img: number }> = ({ img }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;
  const zoomIn = img % 2 === 1;
  const scale = zoomIn
    ? interpolate(p, [0, 1], [1.06, 1.16])
    : interpolate(p, [0, 1], [1.16, 1.06]);
  const drift = zoomIn
    ? interpolate(p, [0, 1], [14, -14])
    : interpolate(p, [0, 1], [-14, 14]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <Img
        src={staticFile(`images/img${img}.png`)}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateX(${drift}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.06) 20%, rgba(0,0,0,0.0) 42%, rgba(0,0,0,0.66) 74%, rgba(0,0,0,0.86) 100%)',
        }}
      />
      <SceneFade from={0.55} />
    </AbsoluteFill>
  );
};
