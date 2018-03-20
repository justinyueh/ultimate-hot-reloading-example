import webpack from 'webpack';
import path from 'path';
import qs from 'querystring';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

// process.traceDeprecation = true;

const env = process.env.NODE_ENV || 'development';

export default {
  mode: 'development',
  // devtool: '#eval-source-map',
  // devtool: false,
  entry: {
    app : [
      './client/app.jsx'
    ].concat(env === 'production' ? [] : 'webpack-hot-middleware/client'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: env === 'production' ? '[name]-[hash].js' : '[name].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin({
      filename: '[name]-[contenthash].css',
      disable: env !== 'production',
    }),
  ],
  optimization: {
    noEmitOnErrors: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          filename: env === 'production' ? "vendor-[chunkhash].js" : 'vendor.js',
          enforce: true
        },
      },
    },
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      request: 'browser-request'
    }
  },
  module: {
    rules: [
      // Javascript
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: path.join(__dirname, 'client'),
      },

      // CSS
      {
        test: /\.css$/,
        include: path.join(__dirname, 'client'),
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
          }]
        })
      }
    ]
  }
};
