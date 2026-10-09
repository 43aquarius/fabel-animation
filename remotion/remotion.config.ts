import { Config } from '@remotion/cli/config';

Config.setBrowserExecutable('/home/z/.cache/ms-playwright/chromium-1243/chrome-linux64/chrome');
Config.setConcurrency(2);
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
