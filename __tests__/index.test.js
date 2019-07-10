import fs from 'fs';
import path from 'path';
import getDiff from '../src';

const getFullPath = (filePath) => {
  const ext = path.extname(filePath).slice(1);
  return path.join('__tests__/__fixtures__/', ext, filePath);
};

test.each([
  ['flatBefore.json', 'flatAfter.json', 'tree', 'resultFlat'],
  ['flatBefore.yml', 'flatAfter.yml', 'tree', 'resultFlat'],
  ['flatBefore.ini', 'flatAfter.ini', 'tree', 'resultFlat'],
  ['nestedBefore.json', 'nestedAfter.json', 'tree', 'resultNestedTree'],
  ['nestedBefore2.json', 'nestedAfter2.json', 'tree', 'resultNestedTree2'],
  ['nestedBefore.yml', 'nestedAfter.yml', 'tree', 'resultNestedTree'],
  ['nestedBefore.ini', 'nestedAfter.ini', 'tree', 'resultNestedTree'],
  ['nestedBefore.json', 'nestedAfter.json', 'plain', 'resultNestedPlain'],
  ['nestedBefore2.json', 'nestedAfter2.json', 'plain', 'resultNestedPlain'],
  ['nestedBefore.yml', 'nestedAfter.yml', 'plain', 'resultNestedPlain'],
  ['nestedBefore.ini', 'nestedAfter.ini', 'plain', 'resultNestedPlain'],
  ['nestedBefore.json', 'nestedAfter.json', 'json', 'resultNestedJSON.json'],
  ['nestedBefore.yml', 'nestedAfter.yml', 'json', 'resultNestedJSON.json'],
  ['nestedBefore.ini', 'nestedAfter.ini', 'json', 'resultNestedJSON.json'],
])(
  'compare %s and %s and show %s diff',
  (filePath1, filePath2, format, resultPath) => {
    const fullPath1 = getFullPath(filePath1);
    const fullPath2 = getFullPath(filePath2);
    const resulFullPath = path.join('__fixtures__/', resultPath);
    const result = fs.readFileSync(path.resolve(__dirname, resulFullPath), 'utf-8');
    expect(getDiff(fullPath1, fullPath2, format)).toBe(result);
  },
);
