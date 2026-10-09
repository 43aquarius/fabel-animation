import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { RQ_VISUAL_SCENES, RQ_TOTAL_FRAMES, END_CARD } from '../../timeline-rq-data';
import type { VisualScene } from '../../timeline-rq-data';
import { Caption } from '../Caption';
import { HookSceneRQ, StorySceneRQ, QuoteSceneRQ } from './StoryRQ';
import { RevealSceneRQ, DefSceneRQ, FossilSceneRQ, CoreSceneRQ, VarSceneRQ, EnvSceneRQ } from './ConceptRQ';
import { CuresIntroSceneRQ, CuresImageSceneRQ, MappingSceneRQ } from './CuresMappingRQ';
import { EndingSceneRQA, EndingSceneRQB, EndCardRQ } from './EndingRQ';

// 场景视觉（不含字幕与音频，由外层段序列统一驱动）
const VisualBody: React.FC<{ vs: VisualScene }> = ({ vs }) => {
  const first = vs.segments[0];
  switch (vs.kind) {
    case 'hook':
      return <HookSceneRQ />;
    case 'story':
      return <StorySceneRQ img={vs.img ?? 1} />;
    case 'quote':
      return <QuoteSceneRQ />;
    case 'reveal':
      return <RevealSceneRQ />;
    case 'concept-def':
      return <DefSceneRQ />;
    case 'concept-core':
      return first.id === 'S14' ? <CoreSceneRQ /> : <VarSceneRQ />;
    case 'concept-env':
      return <EnvSceneRQ />;
    case 'cures':
      if (first.id === 'S17') return <CuresIntroSceneRQ />;
      return <CuresImageSceneRQ images={vs.images ?? [8]} />;
    case 'mapping':
      return <MappingSceneRQ segId={first.id} />;
    case 'ending':
      return first.id === 'S21' ? <EndingSceneRQA /> : <EndingSceneRQB />;
    default:
      return <AbsoluteFill style={{ backgroundColor: '#000' }} />;
  }
};

export const MainRQ: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {RQ_VISUAL_SCENES.map((vs) => (
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
      <Sequence from={RQ_TOTAL_FRAMES - END_CARD} durationInFrames={END_CARD}>
        <EndCardRQ />
      </Sequence>
    </AbsoluteFill>
  );
};
