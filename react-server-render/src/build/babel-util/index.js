import dir from './dir';

// const opts = {
//   presets: 'env',
//   plugins: 'transform-class-properties,
//  transform-decorators-legacy,transform-object-rest-spread,transform-runtime',
//   ignore: [ /(?:(?=.)client)/i ],
//   babelrc: false
// };
//
// opts.presets = [['env', {
//   targets: {
//     node: '8.9.3',
//   },
// }]];
//
// const filenames = ['src'];
//
// const commander = {
//   outDir: 'build',
//   copyFiles: true,
//   sourceMaps: null,
//   extensions: null,
//   skipInitialBuild: null,
//   watch: null,
// };

const babelOptions = {};

export { babelOptions };

export default function babelUtil(options, filenames, commander, callback) {
  Object.assign(babelOptions, options);
  dir(commander, filenames, babelOptions);
  callback('done');
}
