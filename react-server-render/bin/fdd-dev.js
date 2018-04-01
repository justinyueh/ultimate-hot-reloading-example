#!/usr/bin/env node
const path = require('path');
const childProcess = require('child_process');
const { getBabelLoaderOptions } = require('../lib/config');

process.env.npm_package_config_dev = true;

const { plugins } = getBabelLoaderOptions({ dev: true, ssr: true });

const parsedArgs = [
  path.resolve('node_modules/.bin/babel-node'),
  '--presets=env,react',
  `--plugins=${plugins.join(',')}`,
  'src/server.js',
];

const proc = childProcess.spawn(process.argv[0], parsedArgs, {
  stdio: 'inherit',
});

proc.on('exit', (code, signal) => {
  process.on('exit', () => {
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code);
    }
  });
});
