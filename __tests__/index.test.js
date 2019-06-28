import fs from 'fs';
import path from 'path';
import compare from '../src';

const jsonBeforeFlat = '__tests__/__fixtures__/json/flatBefore.json';
const jsonAfterFlat = '__tests__/__fixtures__/json/flatAfter.json';
const jsonBeforeNested = '__tests__/__fixtures__/json/nestedBefore.json';
const jsonAfterNested = '__tests__/__fixtures__/json/nestedAfter.json';

const ymlBeforeFlat = '__tests__/__fixtures__/yml/flatBefore.yml';
const ymlAfterFlat = '__tests__/__fixtures__/yml/flatAfter.yml';
const ymlBeforeNested = '__tests__/__fixtures__/yml/nestedBefore.yml';
const ymlAfterNested = '__tests__/__fixtures__/yml/nestedAfter.yml';

const iniBeforeFlat = '__tests__/__fixtures__/ini/flatBefore.ini';
const iniAfterFlat = '__tests__/__fixtures__/ini/flatAfter.ini';
const iniBeforeNested = '__tests__/__fixtures__/ini/nestedBefore.ini';
const iniAfterNested = '__tests__/__fixtures__/ini/nestedAfter.ini';

const resultFlat = fs.readFileSync(path.resolve(__dirname, '__fixtures__/resultFlat.txt'), 'utf-8');
const resultNestedTree = fs.readFileSync(path.resolve(__dirname, '__fixtures__/resultNestedTree.txt'), 'utf-8');
const resultNestedPlain = fs.readFileSync(path.resolve(__dirname, '__fixtures__/resultNestedPlain.txt'), 'utf-8');
const resultNestedJSON = fs.readFileSync(path.resolve(__dirname, '__fixtures__/resultNestedJSON.json'), 'utf-8');

test('compare flat json files', () => {
  const diff = compare(jsonBeforeFlat, jsonAfterFlat);
  expect(diff).toBe(resultFlat);
});

test('compare flat yml files', () => {
  const diff = compare(ymlBeforeFlat, ymlAfterFlat);
  expect(diff).toBe(resultFlat);
});

test('compare flat ini files', () => {
  const diff = compare(iniBeforeFlat, iniAfterFlat);
  expect(diff).toBe(resultFlat);
});

test('compare nested json files and show tree diff', () => {
  const diff = compare(jsonBeforeNested, jsonAfterNested);
  expect(diff).toBe(resultNestedTree);
});

test('compare nested json files and show plain diff', () => {
  const diff = compare(jsonBeforeNested, jsonAfterNested, 'plain');
  expect(diff).toBe(resultNestedPlain);
});

test('compare nested json files and show JSON diff', () => {
  const diff = compare(jsonBeforeNested, jsonAfterNested, 'json');
  expect(diff).toBe(resultNestedJSON);
});

test('compare nested yml files and show tree diff', () => {
  const diff = compare(ymlBeforeNested, ymlAfterNested);
  expect(diff).toBe(resultNestedTree);
});

test('compare nested yml files and show plain diff', () => {
  const diff = compare(ymlBeforeNested, ymlAfterNested, 'plain');
  expect(diff).toBe(resultNestedPlain);
});

test('compare nested yml files and show yml diff', () => {
  const diff = compare(ymlBeforeNested, ymlAfterNested, 'json');
  expect(diff).toBe(resultNestedJSON);
});

test('compare nested ini files and show tree diff', () => {
  const diff = compare(iniBeforeNested, iniAfterNested);
  expect(diff).toBe(resultNestedTree);
});

test('compare nested ini files and show plain diff', () => {
  const diff = compare(iniBeforeNested, iniAfterNested, 'plain');
  expect(diff).toBe(resultNestedPlain);
});

test('compare nested ini files and show json diff', () => {
  const diff = compare(iniBeforeNested, iniAfterNested, 'json');
  expect(diff).toBe(resultNestedJSON);
});
