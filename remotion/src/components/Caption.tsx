import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import { COLORS, FONTS } from '../theme';

// 按标点断句，贪心组行（每行不超过 maxChars）
export const wrapLines = (text: string, maxChars: number): string[] => {
  const tokens: string[] = [];
  let buf = '';
  for (const ch of text) {
    buf += ch;
    if ('，。；：？！、'.includes(ch)) {
      tokens.push(buf);
      buf = '';
    }
  }
  if (buf) tokens.push(buf);

  const lines: string[] = [];
  let cur = '';
  for (const tok of tokens) {
    if ((cur + tok).length <= maxChars) {
      cur += tok;
    } else {
      if (cur) lines.push(cur);
      if (tok.length <= maxChars) {
        cur = tok;
      } else {
        // 超长 token 硬拆
        for (let i = 0; i < tok.length; i += maxChars) {
          const piece = tok.slice(i, i + maxChars);
          if (i + maxChars >= tok.length) cur = piece;
          else lines.push(piece);
        }
      }
    }
  }
  if (cur) lines.push(cur);
  return lines;
};

// 标记每个字符是否命中关键词
export const keywordMask = (text: string, keywords: string[]): boolean[] => {
  const mask = new Array(text.length).fill(false);
  for (const kw of keywords) {
    const idx = text.indexOf(kw);
    if (idx >= 0) {
      for (let i = idx; i < idx + kw.length; i++) mask[i] = true;
    }
  }
  return mask;
};

// 抖音式逐字揭示字幕：随配音进度，字符从暗到亮，关键词高亮
export const Caption: React.FC<{
  text: string;
  keywords: string[];
  charStarts: number[];
  variant?: 'story' | 'concept';
  bottom?: number;
}> = ({ text, keywords, charStarts, variant = 'story', bottom }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const lines = wrapLines(text, 16);
  const mask = keywordMask(text, keywords);

  const isStory = variant === 'story';
  const baseColor = isStory ? COLORS.white : COLORS.ink;
  const kwColor = isStory ? '#FFD24A' : COLORS.vermilion;
  const fontSize = isStory ? 58 : 44;

  let charIdx = 0;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: bottom ?? 250,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '0 70px',
      }}
    >
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            fontFamily: FONTS.sans,
            fontWeight: 700,
            fontSize,
            lineHeight: 1.45,
            letterSpacing: 2,
            textShadow: isStory
              ? '0 2px 14px rgba(0,0,0,0.75), 0 0 3px rgba(0,0,0,0.9)'
              : '0 1px 0 rgba(245,240,230,0.9)',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}
        >
          {[...line].map((ch, ci) => {
            const i = charIdx++;
            const cs = charStarts[i] ?? 0;
            const active = t >= cs;
            const opacity = active
              ? interpolate(t, [cs, cs + 0.09], [0.3, 1], { extrapolateRight: 'clamp' })
              : 0.28;
            const color = mask[i] && active ? kwColor : baseColor;
            const lift = mask[i] && active
              ? interpolate(t, [cs, cs + 0.12], [4, 0], { extrapolateRight: 'clamp' })
              : 0;
            return (
              <span
                key={ci}
                style={{
                  color,
                  opacity,
                  display: 'inline-block',
                  transform: `translateY(${lift}px)`,
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

// 场景入场压暗（贴片用）
export const SceneFade: React.FC<{ from?: number }> = ({ from = 0.5 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 5], [from, 0], { extrapolateRight: 'clamp' });
  if (opacity <= 0.01) return null;
  return <div style={{ position: 'absolute', inset: 0, backgroundColor: '#000', opacity }} />;
};
