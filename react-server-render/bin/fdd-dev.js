#!/usr/bin/env node
const childProcess = require('child_process');
const program = require('commander');

program.parse(process.argv);

const { args } = program;

if (!args.length) {
  console.error('No file path found');
  process.exit(1);
}

const cwd = process.cwd();

const parsedArgs = [
  `${cwd}/node_modules/babel-cli/lib/_babel-node`,
  '--presets=env,react',
  '--plugins=transform-class-properties,transform-decorators-legacy,transform-object-rest-spread,transform-runtime,react-hot-loader/babel',
  args[0],
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
