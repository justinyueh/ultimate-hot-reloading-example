#!/usr/bin/env node
const path = require('path');
const childProcess = require('child_process');
const program = require('commander');

program.parse(process.argv);

const cwd = process.cwd();

const parsedArgs = [
  path.resolve(cwd, './node_modules/eslint/bin/eslint'),
  '--config',
  path.join(__dirname, '../lib/eslintrc.json'),
  '--ignore-path',
  path.join(__dirname, '../lib/eslintignore'),
  '--ext',
  '.js',
  '--ext',
  '.jsx',
  cwd,
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
