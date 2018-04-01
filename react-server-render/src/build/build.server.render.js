import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { getEnvConfig } from '../config';

const { babelOutDir } = getEnvConfig();

export default (getWebpackConfig) => {
  const baseConfig = getWebpackConfig({
    dev: false,
    ssr: true,
  });

  return new Promise((resolve, reject) => {
    webpack(Object.assign({}, baseConfig, {
      target: 'node',
      entry: {
        reducers: [
          path.resolve('src/client/reducers/index.js'),
        ],
        routes: [
          path.resolve('src/client/routes.jsx'),
        ],
      },
      output: Object.assign({}, baseConfig.output, {
        path: path.resolve(`${babelOutDir}/client`),
        filename: '[name].js',
        libraryTarget: 'commonjs2',
      }),
      externals: [nodeExternals()],
      optimization: {
        minimize: false,
      },
    }))
      .run((err, stats) => {
        if (err) {
          console.error(err);
          reject(err);
          return;
        }

        if (stats.hasErrors()) {
          console.error(stats.toString({
            // Add console colors
            colors: true,
            chunks: true,
          }));
          reject(new Error('build failed'));
          return;
        }

        if (stats.hasWarnings()) {
          const info = stats.toJson();
          console.warn(info.warnings);
        }

        resolve('success');
        // Done processing
      });
  });
};
