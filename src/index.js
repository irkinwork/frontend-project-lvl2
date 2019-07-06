import parse from './parsers';
import getDiff from './getDiff';
import render from './formatters';
import { readFile, getExt } from './utils';

export default (filePath1, filePath2, format = 'tree') => {
  const data1 = readFile(filePath1);
  const data2 = readFile(filePath2);
  const ext1 = getExt(filePath1);
  const ext2 = getExt(filePath2);
  const parsedData1 = parse(data1, ext1);
  const parsedData2 = parse(data2, ext2);
  const calculatedDiff = getDiff(parsedData1, parsedData2);
  return render(calculatedDiff, format);
};
