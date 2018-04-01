import defaults from 'lodash/defaults';
import readdir from 'fs-readdir-recursive';
import { util, transform as babelTransform } from 'babel-core';
import path from 'path';
import fs from 'fs';

import { babelOptions } from './index';

export function chmod(src, dest) {
  fs.chmodSync(dest, fs.statSync(src).mode);
}

export function readdirFilter(filename) {
  return readdir(filename).filter(name => util.canCompile(name));
}

export function shouldIgnore(loc) {
  return util.shouldIgnore(loc, babelOptions.ignore, babelOptions.only);
}

export function addSourceMappingUrl(code, loc) {
  return `${code}\n//# sourceMappingURL=${path.basename(loc)}`;
}

export function transform(filename, code, opts) {
  const options = defaults(opts || {}, babelOptions);
  options.filename = filename;

  const result = babelTransform(code, options);
  result.filename = filename;
  result.actual = code;
  return result;
}

export function compile(filename, opts) {
  try {
    const code = fs.readFileSync(filename, 'utf8');
    return transform(filename, code, opts);
  } catch (err) {
    throw err;
  }
}
