#!/usr/bin/env node
const path = require('path');
const childProcess = require('child_process');

const parsedArgs = [
  path.resolve('node_modules/.bin/babel-node'),
  '--presets=env,react',
  '--plugins=transform-class-properties,transform-decorators-legacy,transform-object-rest-spread,transform-runtime,dynamic-import-node',
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
