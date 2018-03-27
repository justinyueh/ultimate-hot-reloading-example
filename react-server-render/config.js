export const outputPublicPath = '/assets/';

// css module name generator
export const getGenerateScopedName = dev => (dev ? '[path][name]-[local]-[hash:base64:5]' : '[hash:base64:5]');

export const fileLoaderName = '[name]-[hash:base64:5].[ext]';

export const getGenerateOutputFileName = dev => (!dev ? '[name]-[hash].js' : '[name].js');
