import fs from 'fs';
import path from 'path';
import parsers from './parsers';
import getDiff from './getDiff';
import renderTreeDiff from './formatters/tree';
import renderPlainDiff from './formatters/plain';
import renderJSONDiff from './formatters/json';

const readFile = file => fs.readFileSync(path.resolve(process.cwd(), file), 'utf-8');

const renderList = [
  {
    type: 'plain',
    render: diff => renderPlainDiff(diff),
  },
  {
    type: 'tree',
    render: diff => renderTreeDiff(diff),
  },
  {
    type: 'json',
    render: diff => renderJSONDiff(diff),
  },
];

const getRender = format => renderList.find(({ type }) => type === format);

export default (fileName1, fileName2, format = 'tree') => {
  const file1 = readFile(fileName1);
  const file2 = readFile(fileName2);
  const parsedFile1 = parsers(fileName1, file1);
  const parsedFile2 = parsers(fileName2, file2);
  const calculatedDiff = getDiff(parsedFile1, parsedFile2);
  const { render } = getRender(format);
  return render(calculatedDiff);
};
