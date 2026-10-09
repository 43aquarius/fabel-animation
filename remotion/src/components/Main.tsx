import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { VISUAL_SCENES, TOTAL_FRAMES, END_CARD } from '../timeline-data';
import type { VisualScene, TimelineSeg } from '../timeline-data';
import { Caption } from './Caption';
import { HookScene, StoryScene } from './StoryScenes';
import { QuoteScene, RevealScene } from './QuoteRevealScenes';
import { DefScene, NoiseSceneA, NoiseSceneB, NoiseSceneC } from './ConceptScenes';
import { ChartScene } from './ChartScene';
import { CuresScene, MappingScene } from './CuresMappingScenes';
import { EndingSceneA, EndingSceneB, EndCard } from './EndingScenes';

// 场景视觉（不含字幕与音频，由外层段序列统一驱动）
const VisualBody: React.FC<{ vs: VisualScene }> = ({ vs }) => {
  const first = vs.segments[0];
  switch (vs.kind) {
    case 'hook':
      return <HookScene />;
    case 'story':
      return <StoryScene img={vs.img ?? 1} />;
    case 'quote':
      return <QuoteScene />;
    case 'reveal':
      return <RevealScene />;
    case 'concept-def':
      return <DefScene />;
    case 'concept-noise':
      if (first.id === 'S13') return <NoiseSceneA />;
      if (first.id === 'S14') return <NoiseSceneB />;
      return <NoiseSceneC />;
    case 'concept-chart':
      return <ChartScene />;
    case 'cures':
      return <CuresScene seg={first} />;
    case 'mapping':
      return <MappingScene seg={first} />;
    case 'ending':
      return first.id === 'S21' ? <EndingSceneA /> : <EndingSceneB />;
    default:
      return <AbsoluteFill style={{ backgroundColor: '#000' }} />;
  }
};

export const Main: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {VISUAL_SCENES.map((vs) => (
        <Sequence key={vs.key} from={vs.startFrame} durationInFrames={vs.seqFrames}>
          <VisualBody vs={vs} />
          {vs.segments.map((seg) => (
            <Sequence key={seg.id} from={seg.startFrame - vs.startFrame} durationInFrames={seg.frames + seg.gapAfter}>
              <Audio src={staticFile(seg.audio)} />
              {seg.caption ? (
                <Caption text={seg.text} keywords={seg.keywords} charStarts={seg.charStarts} variant={seg.caption} />
              ) : null}
            </Sequence>
          ))}
        </Sequence>
      ))}
      <Sequence from={TOTAL_FRAMES - END_CARD} durationInFrames={END_CARD}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};
