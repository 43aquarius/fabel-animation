import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { COLORS, FONTS } from '../theme';

// 抖音封面（静态构图，1080x1920）：封面插画 + 大标题 + 印章元素
export const Cover: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0908' }}>
      <Img src={staticFile('images/cover.png')} style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }} />
      <AbsoluteFill
        style={{
          background:
            'linear-gradient(180deg, rgba(8,6,4,0.55) 0%, rgba(8,6,4,0.18) 22%, rgba(8,6,4,0.24) 52%, rgba(8,6,4,0.78) 76%, rgba(8,6,4,0.92) 100%)',
        }}
      />

      {/* 顶部角标 */}
      <div style={{ position: 'absolute', top: 140, left: 70, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div
          style={{
            backgroundColor: COLORS.vermilion,
            color: COLORS.white,
            fontFamily: FONTS.sans,
            fontWeight: 700,
            fontSize: 34,
            padding: '10px 22px',
            borderRadius: 8,
            letterSpacing: 2,
          }}
        >
          3 分钟看懂
        </div>
        <div style={{ color: COLORS.white, fontFamily: FONTS.serif, fontWeight: 700, fontSize: 36, letterSpacing: 4, textShadow: '0 2px 12px rgba(0,0,0,0.6)' }}>
          AI 最经典的错
        </div>
      </div>

      {/* 主标题 */}
      <div style={{ position: 'absolute', top: 980, left: 76, right: 76, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 148, color: COLORS.white, letterSpacing: 10, lineHeight: 1.22, textShadow: '0 4px 26px rgba(0,0,0,0.55)' }}>
          画谁像谁
        </div>
        <div style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 148, color: COLORS.white, letterSpacing: 10, lineHeight: 1.22, textShadow: '0 4px 26px rgba(0,0,0,0.55)' }}>
          却画不出
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 6 }}>
          <span style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 148, color: COLORS.white, letterSpacing: 6, textShadow: '0 4px 26px rgba(0,0,0,0.55)' }}>第</span>
          <span style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 200, color: COLORS.gold, lineHeight: 1, textShadow: '0 6px 30px rgba(0,0,0,0.5)' }}>1001</span>
          <span style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 148, color: COLORS.white, letterSpacing: 6, textShadow: '0 4px 26px rgba(0,0,0,0.55)' }}>张脸</span>
        </div>
        <div style={{ width: 560, height: 10, backgroundColor: COLORS.vermilion, marginTop: 18, borderRadius: 4 }} />
      </div>

      {/* 底部印章信息条 */}
      <div style={{ position: 'absolute', bottom: 150, left: 76, right: 76, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            backgroundColor: 'rgba(14,12,10,0.72)',
            border: '2.5px solid rgba(217,166,46,0.75)',
            borderRadius: 10,
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <span style={{ fontFamily: FONTS.serif, fontWeight: 900, fontSize: 44, color: COLORS.gold, letterSpacing: 4 }}>过拟合</span>
          <span style={{ width: 2, height: 40, backgroundColor: 'rgba(217,166,46,0.5)' }} />
          <span style={{ fontFamily: FONTS.sans, fontWeight: 700, fontSize: 30, color: COLORS.grayOnDark, letterSpacing: 1 }}>Overfitting</span>
        </div>
        <div style={{ fontFamily: FONTS.kai, fontSize: 32, color: COLORS.grayOnDark, letterSpacing: 4 }}>机器学习寓言 · 第一话</div>
      </div>
    </AbsoluteFill>
  );
};
