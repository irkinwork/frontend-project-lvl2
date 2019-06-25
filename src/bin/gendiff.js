#!/usr/bin/env node
import compare from '..';

const program = require('commander');

const getFormat = (format) => {
  if (format) {
    return format;
  }
  return '';
};

program
  .description('Compares two configuration files and shows a difference.')
  .arguments('<firstConfig> <secondConfig>')
  .option('-v, --version', 'outut the version number')
  .option('-f, --format [type]', 'output format')
  .action((firstConfig, secondConfig) => {
    if (!program.args.length) {
      program.help();
    }
    console.log(compare(firstConfig, secondConfig, getFormat(program.format)));
  });
program.parse(process.argv);
