#!/usr/bin/env node
const path = require('path');
const childProcess = require('child_process');

const parsedArgs = [
  path.resolve('node_modules/babel-cli/lib/_babel-node'),
  '--presets=env',
  path.resolve(__dirname, '../lib/build/build.js'),
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
