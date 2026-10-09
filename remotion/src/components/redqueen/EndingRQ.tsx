import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { RQC, RQF } from '../../theme-rq';
import { SceneFade } from '../Caption';

// S21 结尾 A：你也在这场比赛里
export const EndingSceneRQA: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const p = frame / 90; // 约 3 秒慢推

  const mainOpacity = interpolate(t, [0.2, 0.9], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const card1Opacity = interpolate(t, [1.8, 2.5], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const card2Opacity = interpolate(t, [3.4, 4.1], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const scale = 1 + p * 0.04;

  return (
    <AbsoluteFill style={{ backgroundColor: RQC.dark }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 70% 40% at 50% 30%, ${RQC.crimsonDeep}45 0%, transparent 72%)`,
          transform: `scale(${scale})`,
        }}
      />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', transform: `scale(${scale})` }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 40 }}>
          <div style={{ fontFamily: RQF.serif, fontWeight: 900, fontSize: 84, color: RQC.white, letterSpacing: 10, opacity: mainOpacity }}>
            你大概也在这场比赛里
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              alignItems: 'center',
            }}
          >
            <div
              style={{
                fontFamily: RQF.sans,
                fontWeight: 600,
                fontSize: 40,
                color: RQC.grayOnDark,
                letterSpacing: 2,
                border: '2px solid rgba(203,193,169,0.3)',
                borderRadius: 14,
                padding: '18px 34px',
                backgroundColor: 'rgba(203,193,169,0.05)',
                opacity: card1Opacity,
              }}
            >
              你读到研究生，招聘要求也涨到了研究生
            </div>
            <div
              style={{
                fontFamily: RQF.sans,
                fontWeight: 600,
                fontSize: 40,
                color: RQC.grayOnDark,
                letterSpacing: 2,
                border: '2px solid rgba(203,193,169,0.3)',
                borderRadius: 14,
                padding: '18px 34px',
                backgroundColor: 'rgba(203,193,169,0.05)',
                opacity: card2Opacity,
              }}
            >
              你加班到十点，隔壁工位十点半
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <SceneFade />
    </AbsoluteFill>
  );
};

// S22 结尾 B：一棵树（金句收束）
export const EndingSceneRQB: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;

  const l1 = interpolate(t, [0.2, 0.8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const l2 = interpolate(t, [2.2, 2.9], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const tail = interpolate(t, [5.2, 6.0], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${RQC.dark} 0%, ${RQC.crimsonDeep}55 55%, ${RQC.dark} 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <AbsoluteFill
        style={{
          opacity: 0.05,
          background: 'repeating-conic-gradient(#FFFFFF 0% 25%, transparent 0% 50%)',
          backgroundSize: '260px 260px',
        }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30, padding: '0 90px' }}>
        <div style={{ fontFamily: RQF.kai, fontSize: 58, color: RQC.grayOnDark, letterSpacing: 4, textAlign: 'center', opacity: l1, lineHeight: 1.6 }}>
          跑得快，解决的是这场比赛里的问题
        </div>
        <div
          style={{
            fontFamily: RQF.kai,
            fontWeight: 700,
            fontSize: 72,
            color: RQC.crimsonBright,
            letterSpacing: 6,
            textAlign: 'center',
            opacity: l2,
            textShadow: `0 4px 36px ${RQC.crimson}77`,
          }}
        >
          换一条赛道，解决的是这场比赛本身
        </div>
        <div style={{ width: 100, height: 5, backgroundColor: RQC.gold, marginTop: 34, opacity: tail }} />
        <div style={{ fontFamily: RQF.kai, fontSize: 40, color: RQC.grayOnDark, letterSpacing: 3, opacity: tail, marginTop: 8, textAlign: 'center' }}>
          下次拼命奔跑的时候，记得抬头看看，有没有一棵树。
        </div>
      </div>
      <SceneFade />
    </AbsoluteFill>
  );
};

// 尾卡：羊皮纸 + 红方印（系列识别）
export const EndCardRQ: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const { durationInFrames } = useVideoConfig();
  const outFade = interpolate(frame, [durationInFrames - 12, durationInFrames - 1], [1, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  const introOpacity = interpolate(t, [0.2, 0.8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const sealSpringOpacity = interpolate(t, [0.8, 1.3], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const subOpacity = interpolate(t, [1.5, 2.1], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const followOpacity = interpolate(t, [2.2, 2.8], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: RQC.parchment, opacity: outFade }}>
      <AbsoluteFill
        style={{
          opacity: 0.1,
          background: 'repeating-conic-gradient(#7A1F2B 0% 25%, transparent 0% 50%)',
          backgroundSize: '220px 220px',
        }}
      />
      <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
          <div style={{ fontFamily: RQF.sans, fontWeight: 600, fontSize: 32, color: RQC.inkSoft, letterSpacing: 10, opacity: introOpacity }}>
            研究生概念 · 寓言动画
          </div>

          {/* 红方印：红后 */}
          <div
            style={{
              opacity: sealSpringOpacity,
              width: 230,
              height: 230,
              backgroundColor: RQC.crimson,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 14px 50px ${RQC.crimson}55`,
              border: `5px solid ${RQC.crimsonDeep}`,
            }}
          >
            <div style={{ fontFamily: RQF.serif, fontWeight: 900, fontSize: 96, color: RQC.parchment, letterSpacing: 6, lineHeight: 1.05, writingMode: 'vertical-rl' }}>
              红后
            </div>
          </div>

          <div style={{ fontFamily: RQF.serif, fontWeight: 900, fontSize: 58, color: RQC.ink, letterSpacing: 6, opacity: subOpacity }}>
            第二话 · 红皇后效应
          </div>
          <div style={{ fontFamily: RQF.kai, fontSize: 34, color: RQC.inkSoft, letterSpacing: 4, opacity: followOpacity }}>
            下一话，讲讲别的概念
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
