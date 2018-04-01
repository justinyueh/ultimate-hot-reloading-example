import stringify from 'babel-runtime/core-js/json/stringify';
import outputFileSync from 'output-file-sync';
import readdir from 'fs-readdir-recursive';
import slash from 'slash';
import path from 'path';
import fs from 'fs';
import { util } from 'babel-core';

import {
  compile,
  addSourceMappingUrl,
  chmod,
  shouldIgnore,
} from './util';

export default function dir(commander, filenames) {
  function write(src, relative) {
    const relativePath = `${relative.replace(/\.(\w*?)$/, '')}.js`;

    const dest = path.join(commander.outDir, relativePath);

    const data = compile(src, {
      sourceFileName: slash(path.relative(`${dest}/..`, src)),
      sourceMapTarget: path.basename(relativePath),
    });
    if (!commander.copyFiles && data.ignored) return;

    if (data.map && commander.sourceMaps && commander.sourceMaps !== 'inline') {
      const mapLoc = `${dest}.map`;
      data.code = addSourceMappingUrl(data.code, mapLoc);
      outputFileSync(mapLoc, stringify(data.map));
    }

    outputFileSync(dest, data.code);
    chmod(src, dest);
  }

  function handleFile(src, filename) {
    if (shouldIgnore(src)) return;

    if (util.canCompile(filename, commander.extensions)) {
      write(src, filename);
    } else if (commander.copyFiles) {
      const dest = path.join(commander.outDir, filename);
      outputFileSync(dest, fs.readFileSync(src));
      chmod(src, dest);
    }
  }

  function handle(filename) {
    if (!fs.existsSync(filename)) return;

    const stat = fs.statSync(filename);

    if (stat.isDirectory(filename)) {
      const dirname = filename;

      readdir(dirname).forEach((name) => {
        const src = path.join(dirname, name);
        handleFile(src, name);
      });
    } else {
      write(filename, filename);
    }
  }

  if (!commander.skipInitialBuild) {
    filenames.forEach(handle);
  }
}
