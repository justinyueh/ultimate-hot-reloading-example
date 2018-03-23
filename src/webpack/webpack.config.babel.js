import webpack from 'webpack';
import path from 'path';
import fs from 'fs';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

// process.traceDeprecation = true;
const baseDir = path.resolve(__dirname, '../..');

class ManifestPlugin {
  apply(compiler) {
    compiler.hooks.done.tap('ManifestPlugin', function(stats) {
      
      const statsJson = stats.toJson();
      const { assetsByChunkName, modules } = statsJson;

      modules.forEach((module) => {
        if (module.assets && module.assets.length) {
          [assetsByChunkName[module.name]] = module.assets;
        }
      });

      fs.mkdir(path.resolve(baseDir, './build/'), () => {
        fs.writeFileSync(
          path.resolve(baseDir, './build/manifest.json'),
          JSON.stringify(assetsByChunkName, null, 2),
        );
      });
    });
  }
}

export default ({ dev, ssr }) => {
  return {
    mode: dev ? 'development' : 'production',
    context: baseDir,
    devtool: !dev ? false : '#eval-source-map',
    entry: {
      app : [
        './src/client/app.jsx'
      ].concat(!dev ? [] : 'webpack-hot-middleware/client'),
      app111 : [
        './src/client/app111.jsx'
      ].concat(!dev ? [] : 'webpack-hot-middleware/client'),
    },
    output: {
      path: path.resolve(__dirname, '../../dist'),
      filename: !dev ? '[name]-[hash].js' : '[name].js',
      publicPath: '/'
    },
    plugins: [
      new ExtractTextPlugin({
        filename: '[name]-[contenthash].css',
        disable: dev,
      }),
    ]
      .concat((!dev && !ssr) ? new ManifestPlugin() : [])
      .concat(dev ? new webpack.HotModuleReplacementPlugin() : []),
    optimization: {
      noEmitOnErrors: true,
      splitChunks: {
        // name: false,
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: "initial",
            name: 'vendor',
            filename: !dev ? "vendor-[chunkhash].js" : 'vendor.js',
            enforce: true
          },
        },
      },
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        // Javascript
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: [
            path.resolve(__dirname, '../../node_modules'),
          ],
          // include: path.join(__dirname, '../client'),
        },

        // CSS
        {
          test: /\.css$/,
          exclude: [
            path.resolve(__dirname, '../../node_modules'),
          ],
          // include: path.join(__dirname, 'client'),
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [{
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: true,
                localIdentName: '[path][name]-[local]',
                camelCase: true,
              },
            }, 'postcss-loader'],
          })
        }
      ]
    }
  };
}