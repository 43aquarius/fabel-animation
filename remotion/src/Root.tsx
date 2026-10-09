import React from 'react';
import { Composition } from 'remotion';
import { Main } from './components/Main';
import { Cover } from './components/Cover';
import { TOTAL_FRAMES, FPS } from './timeline-data';
import { MainRQ } from './components/redqueen/MainRQ';
import { CoverPortraitRQ, CoverLandscapeRQ } from './components/redqueen/CoversRQ';
import { RQ_TOTAL_FRAMES } from './timeline-rq-data';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 第一话：一千张脸（过拟合） */}
      <Composition
        id="ThousandFaces"
        component={Main}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="DouyinCover"
        component={Cover}
        durationInFrames={30}
        fps={FPS}
        width={1080}
        height={1920}
      />

      {/* 第二话：第九只回家的羚羊（红皇后效应） */}
      <Composition
        id="RedQueen"
        component={MainRQ}
        durationInFrames={RQ_TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="RQCoverPortrait"
        component={CoverPortraitRQ}
        durationInFrames={30}
        fps={FPS}
        width={1080}
        height={1920}
      />
      <Composition
        id="RQCoverLandscape"
        component={CoverLandscapeRQ}
        durationInFrames={30}
        fps={FPS}
        width={1920}
        height={1080}
      />
    </>
  );
};
