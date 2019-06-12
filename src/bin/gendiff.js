#!/usr/bin/env node
const program = require('commander');

program
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig>')
  .arguments('<secondConfig>')
  .option('-v, --version', 'outut the version number')
  .option('-f, --format [type]', 'output format')
  .action(() => {
    if (!program.args.length) {
      program.help();
    }
  });

program.parse(process.argv);
