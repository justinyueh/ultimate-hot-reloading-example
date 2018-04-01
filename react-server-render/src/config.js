export const outputPublicPath = '/assets/';

// css module name generator
export function getGenerateScopedName(dev) {
  return dev ? '[path][name]-[local]-[hash:base64:5]' : '[hash:base64:5]';
}

export const fileLoaderName = '[name]-[hash:base64:5].[ext]';

export function getGenerateOutputFileName(dev) {
  return !dev ? '[name]-[hash].js' : '[name].js';
}

export function getBabelLoaderOptions({ dev, ssr }) {
  const options = {
    presets: [
      ssr ? ['env', { targets: { node: '8.9.3' }, module: false }] : 'env',
      'react',
    ],
    plugins: [
      'transform-class-properties',
      'transform-decorators-legacy',
      'transform-object-rest-spread',
      'transform-runtime',
      // 'syntax-dynamic-import',
      // 'react-hot-loader/babel',
    ]
      .concat(ssr ? 'dynamic-import-node' : 'syntax-dynamic-import')
      .concat((dev && !ssr) ? 'react-hot-loader/babel' : []),
  };

  return options;
}

export function getExtractTextPluginFileName(dev) {
  return dev ? '[name].css' : '[name]-[contenthash].css';
}

export function getEnvConfig() {
  const dev = (process.env.npm_package_config_dev === 'true') || false;

  // 静态资源前缀，包括域名和path
  let staticPath = process.env.npm_package_config_staticPath || '/assets/';

  if (!dev && process.env.npm_package_config_staticPathProduction) {
    staticPath = process.env.npm_package_config_staticPathProduction;
  }

  return {
    dev,
    ssr: (process.env.npm_package_config_ssr !== 'false') || false,
    port: process.env.npm_package_config_port || 3000,
    babelOutDir: '.fdd',
    staticPath,
  };
}
