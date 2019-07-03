#!/usr/bin/env node
import compare from '..';
import program from 'commander';

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .arguments('<firstConfig> <secondConfig>')
  .option('-f, --format [type]', 'output format', 'tree')
  .action((firstConfig, secondConfig) => {
    console.log(compare(firstConfig, secondConfig, program.format));
  });
program.parse(process.argv);
