import remove from 'remove';
import path from 'path';

import webpackClient from './webpack.client';
import webpackServerRender from './webpack.server.render';

try {
  remove.removeSync(path.resolve(__dirname, '../../build'));
  remove.removeSync(path.resolve(__dirname, '../../dist'));
} catch (e) {
  console.error(e);
}

async function build() {
  console.time('client build');
  const clientResult = await webpackClient();
  console.log('clientResult:', clientResult);
  console.timeEnd('client build');

  console.time('ssr build');
  const ssrResult = await webpackServerRender();
  console.log('ssrResult:', ssrResult);
  console.timeEnd('ssr build');
};

build();
