import fs from 'fs';
import path from 'path';
import parsers from './parsers';
import getDiff from './utils/getDiff';
import renderDiff, { stringify } from './utils/renderDiff';
import renderPlainDiff from './formatters/plain';

const readFile = fileConfig => fs.readFileSync(path.resolve(process.cwd(), fileConfig), 'utf-8');

export default (firstConfig, secondConfig, format) => {
  const file1 = readFile(firstConfig);
  const file2 = readFile(secondConfig);
  const parsedFile1 = parsers(firstConfig, file1);
  const parsedFile2 = parsers(secondConfig, file2);
  const calculatedDiff = getDiff(parsedFile1, parsedFile2);
  return format === 'plain' ? renderPlainDiff(calculatedDiff) : stringify(renderDiff(calculatedDiff));
};
