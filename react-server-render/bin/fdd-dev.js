#!/usr/bin/env node
const path = require('path');
const childProcess = require('child_process');

const cwd = process.cwd();

const parsedArgs = [
  path.resolve(cwd, './node_modules/babel-cli/lib/_babel-node'),
  '--presets=env,react',
  '--plugins=transform-class-properties,transform-decorators-legacy,transform-object-rest-spread,transform-runtime,react-hot-loader/babel',
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
