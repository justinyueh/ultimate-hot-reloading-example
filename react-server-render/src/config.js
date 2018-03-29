export const outputPublicPath = '/assets/';

// css module name generator
export const getGenerateScopedName = dev => (dev ? '[path][name]-[local]-[hash:base64:5]' : '[hash:base64:5]');

export const fileLoaderName = '[name]-[hash:base64:5].[ext]';

export const getGenerateOutputFileName = dev => (!dev ? '[name]-[hash].js' : '[name].js');

export const getBabelLoaderOptions = ({ dev, ssr }) => {
  const options = {
    presets: ['env', 'react'],
    plugins: [
      'transform-class-properties',
      'transform-decorators-legacy',
      'transform-object-rest-spread',
      'transform-runtime',
      // 'syntax-dynamic-import',
      // 'react-hot-loader/babel',
    ]
      .concat(ssr ? 'dynamic-import-node' : 'syntax-dynamic-import')
      .concat(dev && !ssr ? 'react-hot-loader/babel' : []),
  };

  return options;
}
