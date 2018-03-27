import remove from 'remove';
import path from 'path';
import { exec, spawn } from 'child_process';

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
    process.exit(1);
  }
  console.timeEnd('client build');

  console.time('ssr build');
  try {
    await buildServerRender(webpackConfig);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  console.timeEnd('ssr build');

  console.time('babel build');

  const args = [
    `${cwd}/node_modules/.bin/babel`,
    'src',
    '--out-dir',
    'build',
    '--copy-files',
    '--ignore',
    'client',
    '--presets=env',
    '--colors'
  ];

  var proc = spawn(process.argv[0], args, {
    stdio: ['pipe', 'pipe', process.stderr],
  });

  proc.on("exit", function (code, signal) {
    process.on("exit", function () {
      if (signal) {
        process.kill(process.pid, signal);
      } else {
        process.exit(code);
      }
    });
    console.timeEnd('babel build');
    console.timeEnd('total build');
  });
}
