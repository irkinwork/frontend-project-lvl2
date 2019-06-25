import fs from 'fs';
import path from 'path';
import parsers from './parsers';
import getDiff from './utils/getDiff';
import renderTreeDiff, { stringify } from './formatters/tree';
import renderPlainDiff from './formatters/plain';
import renderJSONDiff from './formatters/json';

const readFile = fileConfig => fs.readFileSync(path.resolve(process.cwd(), fileConfig), 'utf-8');

const renderList = [
  {
    type: 'plain',
    render: diff => renderPlainDiff(diff),
  },
  {
    type: 'tree',
    render: diff => stringify(renderTreeDiff(diff)),
  },
  {
    type: 'json',
    render: diff => renderJSONDiff(diff),
  },
];

const getRender = format => renderList.find(({ type }) => type === format);

export default (firstConfig, secondConfig, format = 'tree') => {
  const file1 = readFile(firstConfig);
  const file2 = readFile(secondConfig);
  const parsedFile1 = parsers(firstConfig, file1);
  const parsedFile2 = parsers(secondConfig, file2);
  const calculatedDiff = getDiff(parsedFile1, parsedFile2);
  const { render } = getRender(format);
  return render(calculatedDiff);
};
