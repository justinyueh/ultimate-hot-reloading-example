import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

const cwd = process.cwd();

export default (webpackConfig) => {
  const baseConfig = webpackConfig({
    dev: false,
    ssr: true,
  });

  return new Promise((resolve, reject) => {
    webpack(Object.assign({}, baseConfig, {
      target: 'node',
      entry: {
        ssr: [
          './src/client/server-render.jsx',
        ],
      },
      output: Object.assign({}, baseConfig.output, {
        path: path.resolve(cwd, './build/client'),
        filename: 'server-render.js',
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
