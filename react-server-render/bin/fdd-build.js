#!/usr/bin/env node
const path = require('path');
const childProcess = require('child_process');

const cwd = process.cwd();

const parsedArgs = [
  `${cwd}/node_modules/babel-cli/lib/_babel-node`,
  '--presets=env',
  path.resolve(__dirname, '../lib/build.js'),
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
