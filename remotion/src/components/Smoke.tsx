import React from 'react';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate } from 'remotion';

export const Smoke: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, fps], [0, 1], { extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ backgroundColor: '#F5F0E6', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ opacity, fontFamily: "'Noto Serif SC', serif", fontWeight: 900, fontSize: 120, color: '#1A1713' }}>
        一千张脸
      </div>
      <div style={{ opacity, fontFamily: "'Sarasa Mono SC', monospace", fontWeight: 700, fontSize: 48, color: '#B33A3A', marginTop: 30 }}>
        1001 · Overfitting
      </div>
    </AbsoluteFill>
  );
};
