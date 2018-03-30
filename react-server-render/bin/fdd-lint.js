#!/usr/bin/env node
const path = require('path');
const childProcess = require('child_process');
const program = require('commander');

program.parse(process.argv);

const cwd = process.cwd();

const parsedArgs = [
  path.resolve('node_modules/eslint/bin/eslint'),
  '--config',
  path.resolve(__dirname, '../lib/eslintrc.json'),
  '--ignore-path',
  path.resolve(__dirname, '../lib/eslintignore'),
  '--ext',
  '.js',
  '--ext',
  '.jsx',
  path.resolve(cwd, 'src'),
  path.resolve(cwd, 'react-server-render/bin'),
  path.resolve(cwd, 'react-server-render/src'),
];

const proc = childProcess.spawn(process.argv[0], parsedArgs, {
  stdio: 'inherit',
});

proc.on('exit', (code, signal) => {
  if (code === 0) {
    console.log('lint success');
  }

  process.on('exit', () => {
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code);
    }
  });
});
