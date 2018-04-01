import webpack from 'webpack';

export default getWebpackConfig => new Promise((resolve, reject) => {
  webpack(getWebpackConfig({
    dev: false,
    ssr: false,
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
