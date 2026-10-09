import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { RQC, RQF } from '../../theme-rq';

// 竖屏封面（抖音 1080x1920）：棋盘封面图 + 大标题 + 信息条
export const CoverPortraitRQ: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0F0B0D' }}>
      <Img src={staticFile('images-rq/rq-cover.png')} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(10,7,9,0.55) 0%, rgba(10,7,9,0.15) 24%, rgba(10,7,9,0.22) 52%, rgba(10,7,9,0.80) 78%, rgba(10,7,9,0.94) 100%)',
        }}
      />

      {/* 顶部角标 */}
      <div style={{ position: 'absolute', top: 140, left: 70, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          style={{
            backgroundColor: RQC.crimson,
            color: RQC.white,
            fontFamily: RQF.sans,
            fontWeight: 700,
            fontSize: 34,
            padding: '10px 22px',
            borderRadius: 8,
            letterSpacing: 2,
          }}
        >
          3 分钟看懂
        </div>
        <div style={{ color: RQC.white, fontFamily: RQF.serif, fontWeight: 700, fontSize: 36, letterSpacing: 4, textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
          内卷的生物学原型
        </div>
      </div>

      {/* 主标题 */}
      <div style={{ position: 'absolute', top: 950, left: 76, right: 76, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontFamily: RQF.serif, fontWeight: 600, fontSize: 54, color: RQC.grayOnDark, letterSpacing: 6, textShadow: '0 2px 14px rgba(0,0,0,0.6)' }}>
          一场没有赢家的比赛
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 8 }}>
          <span style={{ fontFamily: RQF.serif, fontWeight: 900, fontSize: 130, color: RQC.white, letterSpacing: 8, lineHeight: 1.15, textShadow: '0 4px 26px rgba(0,0,0,0.55)' }}>跑了</span>
          <span style={{ fontFamily: RQF.sans, fontWeight: 700, fontSize: 180, color: RQC.gold, lineHeight: 1, textShadow: '0 6px 30px rgba(0,0,0,0.5)' }}>100 万</span>
          <span style={{ fontFamily: RQF.serif, fontWeight: 900, fontSize: 130, color: RQC.white, letterSpacing: 8, lineHeight: 1.15, textShadow: '0 4px 26px rgba(0,0,0,0.55)' }}>年</span>
        </div>
        <div
          style={{
            fontFamily: RQF.serif,
            fontWeight: 900,
            fontSize: 132,
            color: RQC.crimsonBright,
            letterSpacing: 10,
            lineHeight: 1.2,
            marginTop: 10,
            textShadow: '0 4px 30px rgba(210,74,88,0.5)',
          }}
        >
          谁也没赢过谁
        </div>
        <div style={{ width: 560, height: 10, backgroundColor: RQC.crimson, marginTop: 22, borderRadius: 4 }} />
      </div>

      {/* 底部印章信息条 */}
      <div style={{ position: 'absolute', bottom: 150, left: 76, right: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            backgroundColor: 'rgba(16,11,13,0.72)',
            border: `2.5px solid rgba(201,150,46,0.75)`,
            borderRadius: 10,
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span style={{ fontFamily: RQF.serif, fontWeight: 900, fontSize: 44, color: RQC.gold, letterSpacing: 4 }}>红皇后效应</span>
          <span style={{ width: 2, height: 40, backgroundColor: 'rgba(201,150,46,0.5)' }} />
          <span style={{ fontFamily: RQF.sans, fontWeight: 700, fontSize: 28, color: RQC.grayOnDark, letterSpacing: 1 }}>Red Queen Effect</span>
        </div>
        <div style={{ fontFamily: RQF.kai, fontSize: 32, color: RQC.grayOnDark, letterSpacing: 4 }}>演化生物学寓言 · 第二话</div>
      </div>
    </AbsoluteFill>
  );
};

// 横屏封面（B 站 / YouTube / 通用 1920x1080）：横版棋盘图 + 左侧文字
export const CoverLandscapeRQ: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0F0B0D' }}>
      <Img src={staticFile('images-rq/rq-cover-wide.png')} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
      {/* 左侧渐变，保证文字可读 */}
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(90deg, rgba(10,7,9,0.88) 0%, rgba(10,7,9,0.72) 34%, rgba(10,7,9,0.28) 58%, rgba(10,7,9,0.05) 100%)',
        }}
      />

      {/* 顶部角标 */}
      <div style={{ position: 'absolute', top: 92, left: 90, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          style={{
            backgroundColor: RQC.crimson,
            color: RQC.white,
            fontFamily: RQF.sans,
            fontWeight: 700,
            fontSize: 30,
            padding: '8px 20px',
            borderRadius: 8,
            letterSpacing: 2,
          }}
        >
          3 分钟看懂
        </div>
        <div style={{ color: RQC.white, fontFamily: RQF.serif, fontWeight: 700, fontSize: 32, letterSpacing: 4, textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
          内卷的生物学原型
        </div>
      </div>

      {/* 主标题（左侧竖排版） */}
      <div style={{ position: 'absolute', left: 90, top: 300, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ fontFamily: RQF.serif, fontWeight: 600, fontSize: 46, color: RQC.grayOnDark, letterSpacing: 6, textShadow: '0 2px 14px rgba(0,0,0,0.6)' }}>
          一场没有赢家的比赛
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 10 }}>
          <span style={{ fontFamily: RQF.serif, fontWeight: 900, fontSize: 108, color: RQC.white, letterSpacing: 8, lineHeight: 1.1, textShadow: '0 4px 26px rgba(0,0,0,0.55)' }}>跑了</span>
          <span style={{ fontFamily: RQF.sans, fontWeight: 700, fontSize: 150, color: RQC.gold, lineHeight: 1, textShadow: '0 6px 30px rgba(0,0,0,0.5)' }}>100 万</span>
          <span style={{ fontFamily: RQF.serif, fontWeight: 900, fontSize: 108, color: RQC.white, letterSpacing: 8, lineHeight: 1.1, textShadow: '0 4px 26px rgba(0,0,0,0.55)' }}>年</span>
        </div>
        <div
          style={{
            fontFamily: RQF.serif,
            fontWeight: 900,
            fontSize: 110,
            color: RQC.crimsonBright,
            letterSpacing: 10,
            lineHeight: 1.2,
            marginTop: 12,
            textShadow: '0 4px 30px rgba(210,74,88,0.5)',
          }}
        >
          谁也没赢过谁
        </div>
        <div style={{ width: 470, height: 9, backgroundColor: RQC.crimson, marginTop: 24, borderRadius: 4 }} />
      </div>

      {/* 底部信息条 */}
      <div style={{ position: 'absolute', bottom: 96, left: 90, display: 'flex', alignItems: 'center', gap: 20 }}>
        <div
          style={{
            backgroundColor: 'rgba(16,11,13,0.72)',
            border: `2.5px solid rgba(201,150,46,0.75)`,
            borderRadius: 10,
            padding: '12px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: 14,
          }}
        >
          <span style={{ fontFamily: RQF.serif, fontWeight: 900, fontSize: 36, color: RQC.gold, letterSpacing: 4 }}>红皇后效应</span>
          <span style={{ width: 2, height: 32, backgroundColor: 'rgba(201,150,46,0.5)' }} />
          <span style={{ fontFamily: RQF.sans, fontWeight: 700, fontSize: 24, color: RQC.grayOnDark, letterSpacing: 1 }}>Red Queen Effect</span>
        </div>
        <div style={{ fontFamily: RQF.kai, fontSize: 28, color: RQC.grayOnDark, letterSpacing: 4 }}>演化生物学寓言 · 第二话</div>
      </div>
    </AbsoluteFill>
  );
};
