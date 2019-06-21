import fs from 'fs';
import path from 'path';
import compare from '../src';

const file1 = '__tests__/__fixtures__/file1.json';
const file2 = '__tests__/__fixtures__/file2.json';
const file3 = '__tests__/__fixtures__/file3.json';
const file4 = '__tests__/__fixtures__/file1.yml';
const file5 = '__tests__/__fixtures__/file2.yml';
const file6 = '__tests__/__fixtures__/file3.yml';
const file7 = '__tests__/__fixtures__/file1.ini';
const file8 = '__tests__/__fixtures__/file2.ini';
const file9 = '__tests__/__fixtures__/file3.ini';
const file10 = '__tests__/__fixtures__/before.json';
const file11 = '__tests__/__fixtures__/after.json';
const file12 = '__tests__/__fixtures__/before1.json';
const file13 = '__tests__/__fixtures__/after1.json';
const result1 = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result1.txt'), 'utf-8');
const result2 = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result2.txt'), 'utf-8');
const result3 = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result3.txt'), 'utf-8');
const result4 = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result4.txt'), 'utf-8');
const result5 = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result5.txt'), 'utf-8');
const result6 = fs.readFileSync(path.resolve(__dirname, '__fixtures__/result6.txt'), 'utf-8');

test.each([
  /*[file1, file2, result1],*/
  /*[file4, file5, result3],*/
  /*[file7, file8, result3],*/
  /*[file10, file11, result5]*/,
  [file12, file13, result6],
])(
  '.compare file1 and file2',
  (a, b, expected) => {
    expect(compare(a, b)).toBe(expected);
  },
);

/*
test('compare file1 and file2', () => {
  expect(compare(file1, file2)).toBe(result1);
});

test('compare file2 and file3', () => {
  expect(compare(file2, file3)).toBe(result2);
});

test('compare yml file1 and file2', () => {
  expect(compare(file4, file5)).toBe(result3);
});

test('compare yml file2 and file3', () => {
  expect(compare(file5, file6)).toBe(result4);
});

test('compare ini file1 and file2', () => {
  expect(compare(file7, file8)).toBe(result3);
});

test('compare ini file2 and file3', () => {
  expect(compare(file8, file9)).toBe(result4);
});
*/
