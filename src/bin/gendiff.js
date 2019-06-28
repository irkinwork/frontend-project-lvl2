#!/usr/bin/env node
import compare from '..';

const program = require('commander');

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'output format')
  .action((firstConfig, secondConfig) => {
    if (!program.args.length) {
      program.help();
    }
    const format = program.format ? program.format : 'tree';
    console.log(compare(firstConfig, secondConfig, format));
  });
program.parse(process.argv);
