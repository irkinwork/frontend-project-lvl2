import fs from 'fs';
import path from 'path';
import { has, size, keys } from 'lodash';
import parsers from './parsers';

const readFile = fileConfig => fs.readFileSync(path.resolve(process.cwd(), fileConfig), 'utf-8');

const compare = (firstConfig, secondConfig) => {
  const file1 = readFile(firstConfig);
  const file2 = readFile(secondConfig);
  const parsedFile1 = parsers(firstConfig, file1);
  const parsedFile2 = parsers(firstConfig, file2);
  const base = size(parsedFile1) > size(parsedFile2) ? parsedFile1 : parsedFile2;
  const difference = keys(base).reduce((acc, item) => {
    if (!has(parsedFile2, item)) {
      return [...acc, `  - ${item}: ${parsedFile1[item]}`];
    }
    if (parsedFile1[item] !== parsedFile2[item]) {
      return [...acc, `  - ${item} : ${parsedFile1[item]}`, `  + ${item}: ${parsedFile2[item]}`];
    }
    return [...acc, `    ${item}: ${parsedFile1[item]}`];
  }, []);

  return `{\n${difference.join('\n')}\n}`;
};

export default (file1, file2) => compare(file1, file2);
