import babelUtil from './babel-util/';

import { getBabelLoaderOptions, getEnvConfig } from '../config';

const { babelOutDir } = getEnvConfig();

export default function buildServer() {
  return new Promise((resolve) => {
    const options = {
      // presets: [['env', {
      //   targets: {
      //     node: '8.9.3',
      //   },
      // }]],
      // plugins:
      // 'transform-class-properties,transform-decorators-legacy,
      // transform-object-rest-spread,transform-runtime',
      ignore: [/(?:(?=.)client)/i],
      babelrc: false,
      sourceMaps: true,
    };

    Object.assign(options, getBabelLoaderOptions({ ssr: true }));

    const filenames = ['src'];

    const commander = {
      outDir: babelOutDir,
      copyFiles: true,
      sourceMaps: true,
      extensions: null,
      skipInitialBuild: null,
      watch: null,
      quiet: true,
    };

    babelUtil(options, filenames, commander, resolve);
  });
}
