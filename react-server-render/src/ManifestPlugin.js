import path from 'path';
import fs from 'fs';

const cwd = process.cwd();

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

      fs.mkdir(path.resolve(cwd, './build/'), () => {
        fs.writeFileSync(
          path.resolve(cwd, './build/manifest.json'),
          JSON.stringify(assetsByChunkName, null, 2),
        );
      });
    });
  }
}
