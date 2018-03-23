import remove from 'remove';
import path from 'path';
import { transformFile } from 'babel-core';
import { exec } from 'child_process';

import webpackClient from './webpack.client';
import webpackServerRender from './webpack.server.render';

console.time('total build');

try {
  remove.removeSync(path.resolve(__dirname, '../../build'));
  remove.removeSync(path.resolve(__dirname, '../../dist'));
} catch (e) {
  console.error(e);
}

async function build() {
  console.time('client build');
  const clientResult = await webpackClient();
  console.timeEnd('client build');

  console.time('ssr build');
  const ssrResult = await webpackServerRender();
  console.timeEnd('ssr build');

  console.time('babel build');
  exec('babel src --out-dir build --copy-files --ignore client', () => {
    console.timeEnd('babel build');
    console.timeEnd('total build');
  });
};

build();
