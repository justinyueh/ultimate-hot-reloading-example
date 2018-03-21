import path from 'path';
import nodeExternals from 'webpack-node-externals';

import baseConfig from './webpack.config.babel';

module.exports = Object.assign({}, baseConfig, {
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
});
