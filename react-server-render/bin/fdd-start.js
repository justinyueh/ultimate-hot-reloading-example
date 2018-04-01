#!/usr/bin/env node
const path = require('path');
const { getEnvConfig } = require('../lib/config');

const { babelOutDir } = getEnvConfig();
// eslint-disable-next-line import/no-dynamic-require
require(path.resolve(`${babelOutDir}/server.js`));
