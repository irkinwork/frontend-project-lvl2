import compare from '../src';
import fs from 'fs';
import path from 'path';

const file1 = '__tests__/__fixtures__/file1.json';
const file2 = '__tests__/__fixtures__/file2.json';
const file3 = '__tests__/__fixtures__/file3.json';
const result1 = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result1.txt'), 'utf-8');
const result2 = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result2.txt'), 'utf-8');
test('compare file1 and file2', () => {
  expect(compare(file1, file2)).toBe(result1);
});

test('compare file2 and file3', () => {
  expect(compare(file2, file3)).toBe(result2);
});
