import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';
import { RQC, RQF, RQ_IMG_FILTER } from '../../theme-rq';
import { SceneFade } from '../Caption';

// 开场钩子：棋盘封面图打底 + 大字排版 + 数字冲击
export const HookSceneRQ: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const t = frame / fps;

  const appear = (at: number) =>
    interpolate(t, [at, at + 0.35], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const rise = (at: number) =>
    interpolate(t, [at, at + 0.4], [26, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  const punchSpring = spring({ frame: frame - Math.round(5.8 * fps), fps, config: { damping: 9, stiffness: 160 } });
  const punchOpacity = interpolate(t, [5.75, 6.05], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  const kb = frame / durationInFrames;
  const scale = interpolate(kb, [0, 1], [1.08, 1.15]);

  return (
    <AbsoluteFill style={{ backgroundColor: RQC.dark }}>
      <Img
        src={staticFile('images-rq/rq-cover.png')}
        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale})` }}
      />
      <AbsoluteFill style={{ backgroundColor: 'rgba(13,9,11,0.66)' }} />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 96, paddingRight: 70 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, opacity: appear(0.25), transform: `translateY(${rise(0.25)}px)` }}>
            <span style={{ fontFamily: RQF.serif, fontWeight: 600, fontSize: 50, color: RQC.grayOnDark }}>一场跑了</span>
            <span style={{ fontFamily: RQF.sans, fontWeight: 700, fontSize: 150, color: RQC.gold, lineHeight: 1 }}>100 万年</span>
            <span style={{ fontFamily: RQF.serif, fontWeight: 600, fontSize: 50, color: RQC.grayOnDark }}>的比赛</span>
          </div>
          <div style={{ fontFamily: RQF.serif, fontWeight: 700, fontSize: 62, color: RQC.white, letterSpacing: 6, marginTop: 24, opacity: appear(2.2), transform: `translateY(${rise(2.2)}px)` }}>
            羚羊，快了十倍
          </div>
          <div style={{ fontFamily: RQF.serif, fontWeight: 700, fontSize: 62, color: RQC.white, letterSpacing: 6, opacity: appear(3.6), transform: `translateY(${rise(3.6)}px)` }}>
            豹，也快了十倍
          </div>
          <div
            style={{
              fontFamily: RQF.serif,
              fontWeight: 900,
              fontSize: 112,
              color: RQC.crimsonBright,
              letterSpacing: 10,
              marginTop: 30,
              opacity: punchOpacity,
              transform: `scale(${0.82 + 0.18 * punchSpring}) translateY(${rise(5.8)}px)`,
              textShadow: '0 4px 30px rgba(210,74,88,0.4)',
            }}
          >
            谁也没赢过谁
          </div>
        </div>
      </AbsoluteFill>
      <SceneFade />
    </AbsoluteFill>
  );
};

// 故事场景：插画 + 统一调色 + Ken Burns + 渐变遮罩（字幕由 MainRQ 按段驱动）
export const StorySceneRQ: React.FC<{ img: number }> = ({ img }) => {
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
    <AbsoluteFill style={{ backgroundColor: RQC.dark }}>
      <Img
        src={staticFile(`images-rq/img${img}.png`)}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translateX(${drift}px)`,
          filter: RQ_IMG_FILTER,
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

// 祖母金句：深红黑底 + 楷体三行 + 缓慢放大（本片的情绪顶点）
export const QuoteSceneRQ: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const t = frame / fps;
  const p = frame / durationInFrames;

  const appear = (at: number) =>
    interpolate(t, [at, at + 0.5], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scale = interpolate(p, [0, 1], [1.0, 1.06]);

  return (
    <AbsoluteFill style={{ backgroundColor: RQC.dark }}>
      {/* 极淡棋盘纹理底 */}
      <AbsoluteFill
        style={{
          opacity: 0.05,
          background:
            'repeating-conic-gradient(#FFFFFF 0% 25%, transparent 0% 50%)',
          backgroundSize: '220px 220px',
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 42%, ${RQC.crimsonDeep}55 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${scale})` }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26, padding: '0 90px' }}>
          <div style={{ fontFamily: RQF.kai, fontSize: 54, color: RQC.grayOnDark, letterSpacing: 6, opacity: appear(0.3) }}>
            我们跑得越来越快，
          </div>
          <div style={{ fontFamily: RQF.kai, fontSize: 54, color: RQC.grayOnDark, letterSpacing: 6, opacity: appear(1.6) }}>
            不是为了去远方，
          </div>
          <div
            style={{
              fontFamily: RQF.kai,
              fontWeight: 700,
              fontSize: 84,
              color: RQC.crimsonBright,
              letterSpacing: 8,
              marginTop: 20,
              opacity: appear(3.0),
              textShadow: '0 4px 34px rgba(210,74,88,0.45)',
            }}
          >
            是为了还能站在原地。
          </div>
          <div
            style={{
              width: 120,
              height: 6,
              backgroundColor: RQC.crimson,
              marginTop: 40,
              opacity: appear(4.2),
            }}
          />
        </div>
      </AbsoluteFill>
      <SceneFade />
    </AbsoluteFill>
  );
};
