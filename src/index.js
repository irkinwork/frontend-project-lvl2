import fs from 'fs';
import path from 'path';
import parsers from './parsers';
import getDiff from './utils/getDiff';
import parseDiff, { stringify } from './utils/parseDiff';

const readFile = fileConfig => fs.readFileSync(path.resolve(process.cwd(), fileConfig), 'utf-8');
const compare = (firstConfig, secondConfig) => {
  const file1 = readFile(firstConfig);
  const file2 = readFile(secondConfig);
  const parsedFile1 = parsers(firstConfig, file1);
  const parsedFile2 = parsers(secondConfig, file2);
  const calculatedDiff = getDiff(parsedFile1, parsedFile2);
  return stringify(parseDiff(calculatedDiff));
};

export default (file1, file2) => compare(file1, file2);
