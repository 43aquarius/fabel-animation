import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { RQC, RQF, RQ_IMG_FILTER } from '../../theme-rq';
import { SceneFade } from '../Caption';

// S17 出路引入：深红底文字卡
export const CuresIntroSceneRQ: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  const qOpacity = interpolate(t, [0.2, 0.7], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const aOpacity = interpolate(t, [1.5, 2.2], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(165deg, ${RQC.crimsonDeep} 0%, ${RQC.dark} 72%)`,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 100,
        paddingRight: 80,
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.07,
          background: 'repeating-conic-gradient(#FFFFFF 0% 25%, transparent 0% 50%)',
          backgroundSize: '240px 240px',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 34 }}>
        <div style={{ fontFamily: RQF.serif, fontWeight: 900, fontSize: 96, color: RQC.white, letterSpacing: 10, opacity: qOpacity }}>
          那怎么办？
        </div>
        <div style={{ fontFamily: RQF.serif, fontWeight: 700, fontSize: 62, color: RQC.gold, letterSpacing: 4, lineHeight: 1.5, opacity: aOpacity }}>
          演化史上的赢家，
          <br />
          从来不是跑得最快的。
        </div>
      </div>
      <SceneFade />
    </AbsoluteFill>
  );
};

// S18/S19 出路插画：按段时长均分 crossfade（鲸 → 长颈鹿；蜜蜂花）
export const CuresImageSceneRQ: React.FC<{ images: number[] }> = ({ images }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;

  const n = Math.max(1, images.length);
  const slot = 1 / n;
  const fadeFrac = 0.18; // crossfade 占比

  return (
    <AbsoluteFill style={{ backgroundColor: RQC.dark }}>
      {images.map((img, i) => {
        const start = i * slot;
        const end = start + slot;
        let opacity: number;
        if (i === 0) {
          opacity = p < end - fadeFrac ? 1 : interpolate(p, [end - fadeFrac, end], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
        } else if (i === n - 1) {
          opacity = p < start + fadeFrac ? interpolate(p, [start, start + fadeFrac], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) : 1;
        } else {
          opacity =
            (p < start + fadeFrac ? interpolate(p, [start, start + fadeFrac], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) : 1) *
            (p > end - fadeFrac ? interpolate(p, [end - fadeFrac, end], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }) : 1);
        }
        const scale = interpolate(p, [start, end], [1.08, 1.18]);
        return (
          <Img
            key={img}
            src={staticFile(`images-rq/img${img}.png`)}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity,
              transform: `scale(${scale})`,
              filter: RQ_IMG_FILTER,
            }}
          />
        );
      })}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.06) 20%, rgba(0,0,0,0.0) 42%, rgba(0,0,0,0.66) 74%, rgba(0,0,0,0.86) 100%)',
        }}
      />
      {/* 生态位分化标签（前半场浮现） */}
      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            top: 190,
            left: 0,
            right: 0,
            textAlign: 'center',
            fontFamily: RQF.sans,
            fontWeight: 700,
            fontSize: 40,
            color: RQC.parchment,
            letterSpacing: 8,
            opacity: interpolate(p, [0.05, 0.16], [0, 0.92], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }),
            textShadow: '0 2px 18px rgba(0,0,0,0.8)',
          }}
        >
          生态位分化 · 换一条赛道
        </div>
      )}
      <SceneFade from={0.55} />
    </AbsoluteFill>
  );
};

// S20 隐喻对照表：羊皮纸 + 六条对照依次浮现
const MAPPING_ROWS: { story: string; concept: string; hot?: boolean }[] = [
  { story: '羚羊代代变快', concept: '持续演化' },
  { story: '豹同步变快', concept: '共演化军备竞赛' },
  { story: '回家九只', concept: '不变的相对胜率' },
  { story: '山、河、风', concept: '不变的非生物环境' },
  { story: '祖母的旧疤', concept: '选择压留下的记录' },
  { story: '拼命跑才能站在原地', concept: '红皇后假说', hot: true },
];

export const MappingSceneRQ: React.FC<{ segId: string }> = ({ segId }) => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  const titleOpacity = interpolate(t, [0.1, 0.6], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const rowGap = 2.9; // 每条浮现间隔（秒）
  const firstDelay = 1.2;

  return (
    <AbsoluteFill style={{ backgroundColor: RQC.parchment }}>
      <AbsoluteFill
        style={{
          opacity: 0.07,
          background: 'repeating-conic-gradient(#7A1F2B 0% 25%, transparent 0% 50%)',
          backgroundSize: '320px 320px',
        }}
      />
      {/* 标题 */}
      <div
        style={{
          position: 'absolute',
          top: 150,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: RQF.serif,
          fontWeight: 900,
          fontSize: 62,
          color: RQC.ink,
          letterSpacing: 10,
          opacity: titleOpacity,
        }}
      >
        隐喻对照 · 第二话
      </div>
      <div
        style={{
          position: 'absolute',
          top: 236,
          left: 250,
          right: 250,
          height: 3,
          backgroundColor: RQC.crimson,
          opacity: 0.6 * titleOpacity,
        }}
      />

      {/* 对照行 */}
      <div
        style={{
          position: 'absolute',
          top: 320,
          left: 70,
          right: 70,
          display: 'flex',
          flexDirection: 'column',
          gap: 22,
        }}
      >
        {MAPPING_ROWS.map((row, i) => {
          const at = firstDelay + i * rowGap;
          const rowOpacity = interpolate(t, [at, at + 0.5], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
          const rowRise = interpolate(t, [at, at + 0.5], [18, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
          const hot = row.hot;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                opacity: rowOpacity,
                transform: `translateY(${rowRise}px)`,
                backgroundColor: hot ? `${RQC.crimson}14` : 'rgba(255,255,255,0.5)',
                border: hot ? `2.5px solid ${RQC.crimson}` : '2px solid rgba(36,28,20,0.14)',
                borderRadius: 14,
                padding: '18px 28px',
              }}
            >
              <div style={{ flex: 1, textAlign: 'right', fontFamily: RQF.kai, fontSize: 42, color: RQC.ink, letterSpacing: 2 }}>{row.story}</div>
              <div style={{ width: 0, height: 0, borderLeft: `22px solid ${hot ? RQC.crimson : 'rgba(36,28,20,0.4)'}`, borderTop: '13px solid transparent', borderBottom: '13px solid transparent' }} />
              <div style={{ flex: 1.2, fontFamily: RQF.sans, fontWeight: hot ? 700 : 600, fontSize: 40, color: hot ? RQC.crimson : RQC.inkSoft, letterSpacing: 1 }}>{row.concept}</div>
            </div>
          );
        })}
      </div>
      {/* 占位避免未使用告警 */}
      <div style={{ display: 'none' }}>{segId}</div>
      <SceneFade />
    </AbsoluteFill>
  );
};
