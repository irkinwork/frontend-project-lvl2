import fs from 'fs';
import path from 'path';
import parsers from './parsers';
import getDiff from './getDiff';
import render from './formatters';

export const readFile = filePath => fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8');

export default (filePath1, filePath2, format = 'tree') => {
  const data1 = readFile(filePath1);
  const data2 = readFile(filePath2);
  const parsedData1 = parsers(filePath1, data1);
  const parsedData2 = parsers(filePath2, data2);
  const calculatedDiff = getDiff(parsedData1, parsedData2);
  return render(calculatedDiff, format);
};
