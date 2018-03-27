#!/usr/bin/env node
var child_process = require("child_process");
var program = require("commander");

program.parse(process.argv);

var args = program.args;

if (!args.length) {
  console.error('No file path found');
  process.exit(1);
}

var cwd = process.cwd();

var args = [
  cwd + '/node_modules/babel-cli/lib/_babel-node',
  '--presets=env',
  args[0]
];

var proc = child_process.spawn(process.argv[0], args, {
  stdio: 'inherit',
});

proc.on("exit", function (code, signal) {
  process.on("exit", function () {
    if (signal) {
      process.kill(process.pid, signal);
    } else {
      process.exit(code);
    }
  });
});
