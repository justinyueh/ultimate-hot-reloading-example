import path from 'path';
import fs from 'fs';
import { getEnvConfig } from './config';

const { babelOutDir } = getEnvConfig();

export default class ManifestPlugin {
  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    compiler.hooks.done.tap('ManifestPlugin', (stats) => {
      const statsJson = stats.toJson();
      const { assetsByChunkName, modules } = statsJson;

      modules.forEach((module) => {
        if (module.assets && module.assets.length) {
          [assetsByChunkName[module.name]] = module.assets;
        }
      });

      fs.mkdir(path.resolve(babelOutDir), () => {
        fs.writeFileSync(
          path.resolve(`${babelOutDir}/manifest.json`),
          JSON.stringify(assetsByChunkName, null, 2),
        );
      });
    });
  }
}
