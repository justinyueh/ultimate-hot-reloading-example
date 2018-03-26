import WebpackConfigCreator from '../../react-server-render/WebpackConfigCreator';

const { webpackConfig } = new WebpackConfigCreator({
  entry: {
    app: './src/client/app.jsx',
    app111: './src/client/app111.jsx',
  },
});

export default webpackConfig;
