import webpack from 'webpack';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import ManifestPlugin from './ManifestPlugin';

// process.traceDeprecation = true;
const cwd = process.cwd();

export default class WebpackConfigCreator {
  constructor(webpackConfig) {
    this.userConfig = webpackConfig;

    this.webpackConfig = (...params) => this.createWebpackConfig(...params);
  }

  static createEntry(entry, dev) {
    if (typeof entry === 'string') {
      return [entry].concat(!dev ? [] : 'webpack-hot-middleware/client');
    }

    if (Object.prototype.toString.call(entry) === '[object Array]') {
      return [...entry].concat(!dev ? [] : 'webpack-hot-middleware/client');
    }

    console.error(new Error('Illegal entry type'));
    process.exit();
    return null;
  }

  static createEntrys(config, dev) {
    if (!config.entry) {
      console.error(new Error('You should have a webpack entry point'));
      process.exit();
    }

    if (typeof config.entry === 'string') {
      return {
        app: WebpackConfigCreator.createEntry(config.entry, dev),
      };
    }

    if (typeof config.entry === 'object') {
      const entry = {};
      Object.keys(config.entry).forEach((entryName) => {
        entry[entryName] = WebpackConfigCreator.createEntry(config.entry[entryName], dev);
      });
      return entry;
    }

    console.error(new Error('Illegal entry type'));
    process.exit();
    return null;
  }

  createWebpackConfig({ dev, ssr }) {
    const defaultConfig = {
      mode: dev ? 'development' : 'production',
      context: cwd,
      devtool: !dev ? false : '#eval-source-map',
      // entry: {
      //   app: [
      //     './src/client/app.jsx',
      //   ].concat(!dev ? [] : 'webpack-hot-middleware/client'),
      //   app111: [
      //     './src/client/app111.jsx',
      //   ].concat(!dev ? [] : 'webpack-hot-middleware/client'),
      // },
      output: {
        path: path.resolve(cwd, './dist'),
        filename: !dev ? '[name]-[hash].js' : '[name].js',
        publicPath: '/',
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
              chunks: 'initial',
              name: 'vendor',
              filename: !dev ? 'vendor-[chunkhash].js' : 'vendor.js',
              enforce: true,
            },
          },
        },
      },
      resolve: {
        extensions: ['.js', '.jsx', '.json'],
      },
      module: {
        rules: [
          // Javascript
          {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            exclude: [
              path.resolve(cwd, './node_modules'),
            ],
            // include: path.join(__dirname, '../client'),
          },

          // CSS
          {
            test: /\.css$/,
            exclude: [
              path.resolve(cwd, './node_modules'),
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
            }),
          },
        ],
      },
    };

    defaultConfig.entry = WebpackConfigCreator.createEntrys(this.userConfig, dev);

    return defaultConfig;
  }
}

