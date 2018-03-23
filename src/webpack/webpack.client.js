import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

import webpackConfig from './webpack.config.babel';

export default () => {
  return new Promise((resolve) => {
    webpack(webpackConfig({
      dev: false,
      ssr: false,
    }), (err, stats) => {
      if (err || stats.hasErrors()) {
        console.error(err);
        throw err;
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
};
