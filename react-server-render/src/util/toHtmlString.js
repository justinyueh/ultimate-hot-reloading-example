import path from 'path';
import fs from 'fs';
import debug from 'debug';

import { getScript, getCss } from './assetsHelper';

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

export default ({
  markup = '',
  view = '',
  keyValues = {},
  dev = false,
  entry = 'app',
  staticPath = '/',
}) => {
  let template = defaultTemplate;

  if (view) {
    const templateDir = dev ? 'src/views' : 'build/views';
    const filePath = path.resolve(templateDir, view);

    if (fs.existsSync(filePath)) {
      log('load page template from %s', filePath);

      template = fs.readFileSync(filePath).toString().replace(BOM, '');
    } else {
      log('template file `%s` not exists, load from default template', filePath);
    }
  } else {
    log('load page from default template');
  }

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
};
