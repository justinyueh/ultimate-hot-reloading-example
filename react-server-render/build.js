import remove from 'remove';
import path from 'path';
import { exec } from 'child_process';

import buildClient from './build.client';
import buildServerRender from './build.server.render';

const cwd = process.cwd();

export default async function build(webpackConfig) {
  console.time('total build');
  try {
    remove.removeSync(path.resolve(cwd, './build'));
    remove.removeSync(path.resolve(cwd, './dist'));
  } catch (e) {
    //
  }
  console.time('client build');
  try {
    await buildClient(webpackConfig);
  } catch (e) {
    console.error(e);
    process.exit();
  }
  console.timeEnd('client build');

  console.time('ssr build');
  try {
    await buildServerRender(webpackConfig);
  } catch (e) {
    console.error(e);
    process.exit();
  }
  console.timeEnd('ssr build');

  console.time('babel build');
  exec('babel src --out-dir build --copy-files --ignore client --colors', (err) => {
    if (err) {
      console.error(err);
      process.exit();
    }
    console.timeEnd('babel build');
    console.timeEnd('total build');
  });
}
