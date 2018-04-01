import path from 'path';
import debug from 'debug';
import { getEnvConfig } from '../config';

const { babelOutDir } = getEnvConfig();

const log = debug('ssr:assetshelper');

function createScriptTag(src) {
  return `<script src=${src}></script>`;
}

function createCssTag(href) {
  return `<link rel="stylesheet" href=${href}>`;
}

export function getScript(name, staticPath, dev) {
  let manifest = {};

  if (!dev) {
    try {
      // eslint-disable-next-line
      manifest = require(path.resolve(`${babelOutDir}/manifest.json`));
    } catch (e) { log(e); }
  }

  if (!manifest[name]) {
    return createScriptTag(`${staticPath}${name}.js`);
  } else if (Array.isArray(manifest[name])) {
    return createScriptTag(`${staticPath}${manifest[name][0]}`);
  }
  return createScriptTag(`${staticPath}${manifest[name]}`);
}

export function getCss(name, staticPath, dev) {
  let manifest = {};

  if (!dev) {
    try {
      // eslint-disable-next-line
      manifest = require(path.resolve(`${babelOutDir}/manifest.json`));
    } catch (e) { log(e); }
  }

  if (manifest[name] && Array.isArray(manifest[name])) {
    return createCssTag(`${staticPath}${manifest[name][1]}`);
  }
  return '';
}
