import webpack from 'webpack';
import path from 'path';
import qs from 'querystring';

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
        loader: 'style-loader!css-loader?' + qs.stringify({
          modules: true,
          importLoaders: 1,
          localIdentName: '[path][name]-[local]'
        })
      }

    ]
  }
};
