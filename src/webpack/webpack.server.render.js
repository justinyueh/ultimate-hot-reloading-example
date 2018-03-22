import path from 'path';
import webpack from 'webpack';
import nodeExternals from 'webpack-node-externals';

import webpackConfig from './webpack.config.babel';

export default () => {
  const baseConfig = webpackConfig({
    dev: false,
    ssr: true,
  });

  return new Promise((resolve) => {
    console.log('ssr');
    webpack(Object.assign({}, baseConfig, {
      target: 'node',
      entry: {
        ssr: [
          './src/client/server-render.jsx',
        ],
      },
      output: Object.assign({}, baseConfig.output, {
        path: path.resolve(__dirname, '../../build/client'),
        filename: 'server-render.js',
        libraryTarget: 'commonjs2',
      }),
      externals: [nodeExternals()],
      optimization: {
        minimize: false,
      },
    }), (err, stats) => {
      if (err || stats.hasErrors()) {
        console.error(err);
        // Handle errors here
      } else {
        resolve('success');
      }
      // Done processing
    });
  })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}