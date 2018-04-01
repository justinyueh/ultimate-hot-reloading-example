import path from 'path';
import fs from 'fs';
import debug from 'debug';

import { getScript, getCss } from './assetsHelper';
import { getEnvConfig } from '../config';

const { babelOutDir } = getEnvConfig();

const log = debug('ssr:tohtmlstring');

const defaultTemplate = `<!DOCTYPE html>
<html>
  <head>
    <title><!-- TITLE --></title>
    <!-- META -->
    <!-- LINK -->
    <!-- STYLESHEET -->
  </head>
  <body>
    <!-- HEADER -->
    <div id="root"><!-- CONTENT --></div>
    <!-- FOOTER -->
    <!-- JAVASCRIPT -->
  </body>
</html>`;

const BOM = /^\uFEFF/;

const isProd = process.env.NODE_ENV === 'production';

// view cache for production
const caches = {};

function loadTemplate(dev, view) {
  let template = defaultTemplate;

  // cache views when production
  if (isProd && !dev && view && caches[view]) {
    log('load page template from cache');
    return caches[view];
  }

  if (view) {
    const templateDir = dev ? 'src/views' : `${babelOutDir}/views`;
    const filePath = path.resolve(templateDir, view);

    if (fs.existsSync(filePath)) {
      log('load page template from %s', filePath);

      template = fs.readFileSync(filePath).toString().replace(BOM, '');
      caches[view] = template;
    } else {
      log('template file `%s` not exists, load from default template', filePath);
    }
  } else {
    log('load page from default template');
  }

  return template;
}

export default function toHtmlString({
  markup = '',
  view = '',
  keyValues = {},
  dev = false,
  entry = 'app',
  staticPath = '/',
}) {
  let template = loadTemplate(dev, view);

  Object.keys(keyValues).forEach((key) => {
    template = template.replace(`<!-- ${key.toUpperCase()} -->`, keyValues[key] || '');
  });

  template = template.replace(
    '<!-- STYLESHEET -->',
    getCss('vendor', staticPath, dev) + getCss(entry, staticPath, dev),
  );

  template = template.replace(
    '<!-- JAVASCRIPT -->',
    getScript('vendor', staticPath, dev) + getScript(entry, staticPath, dev),
  );

  return template.replace('<!-- CONTENT -->', markup);
}
