import fs from 'fs';
import path from 'path';
import { flatten } from 'lodash';
import getDiff from '../src';

const getFullPath = (filename, ext) => path.join('__tests__/__fixtures__/', ext, `${filename}.${ext}`);

const formats = ['tree', 'plain', 'json'];
const exts = ['json', 'yml', 'ini'];

const nested = flatten(formats
  .map(format => exts
    .map(ext => ['nested', ext, format])));

const flat = exts.map(ext => ['flat', ext, 'tree']);

const mapResult = {
  flat: () => 'flatResult',
  nested: format => `${format}NestedResult`,
  complexNested: format => `${format}ComplexNestedResult`,
};

test.each([...flat, ...nested, ['complexNested', 'json', 'tree']])(
  'compare %s %s files and show %s diff',
  (type, ext, format) => {
    const before = getFullPath(`${type}Before`, ext);
    const after = getFullPath(`${type}After`, ext);
    const getResultName = mapResult[type];
    const resultFullPath = path.join('__fixtures__/', getResultName(format));
    const result = fs.readFileSync(path.resolve(__dirname, resultFullPath), 'utf-8');
    expect(getDiff(before, after, format)).toBe(result);
  },
);
