import fs from 'fs';
import path from 'path';
import { has, isObject } from 'lodash';
import parsers from './parsers';

const readFile = fileConfig => fs.readFileSync(path.resolve(process.cwd(), fileConfig), 'utf-8');

const compare = (firstConfig, secondConfig) => {
  const file1 = readFile(firstConfig);
  const file2 = readFile(secondConfig);
  const parsedFile1 = parsers(firstConfig, file1);
  const parsedFile2 = parsers(secondConfig, file2);
  const base = { ...parsedFile1, ...parsedFile2 };
  const getDiff = (commonData, data1, data2) => Object.keys(commonData)
    .reduce((acc, key) => {
      if (isObject(data1[key]) && isObject(data2[key])) {
        return { ...acc, [key]: getDiff({ ...data1[key], ...data2[key] }, data1[key], data2[key]) };
      }
      if (!has(data1, key)) {
        return { ...acc, [key]: { status: 'added', value: commonData[key] } };
      }
      if (!has(data2, key)) {
        return { ...acc, [key]: { status: 'removed', value: commonData[key] } };
      }
      if (typeof data1[key] !== typeof data2[key]) {
        return {
          ...acc,
          [key]: {
            status: 'changed',
            valueBefore: data1[key],
            valueAfter: data2[key],
          },
        };
      }
      if (data1[key] !== data2[key]) {
        return { ...acc, [key]: { status: 'changed', valueBefore: data1[key], valueAfter: data2[key] } };
      }
      return { ...acc, [key]: { status: 'unchanged', value: commonData[key] } };
    }, {});
  const stringify = (value, indent) => JSON.stringify(value)
    .replace(/"/g, '')
    .replace(/\\/g, '')
    .replace(/,/g, '\n')
    .replace(/:/g, ': ')
    .replace(/{/g, `{\n${' '.repeat(indent)}`)
    .replace(/}/g, `\n${' '.repeat(indent)}}\n`);
  const parseInnerValue = (value, indent) => Object.keys(value)
    .reduce((acc, key) => {
      const indentedKey = `${' '.repeat(indent)}${key}`;
      return isObject(value[key])
        ? { ...acc, [indentedKey]: parseInnerValue(value[key]) }
        : { ...acc, [indentedKey]: value[key] }
    }, {});

  const parseDiff = (diff, indent = 2) => Object.keys(diff)
    .reduce((acc, key) => {
      const plusKey = `${' '.repeat(indent)}+ ${key}`;
      const minusKey = `${' '.repeat(indent)}- ${key}`;
      const simpleKey = `${' '.repeat(indent)}${key}`;
      const simpleKeyDeep = `  ${key}`;
      switch (diff[key].status) {
        case 'unchanged':
          return {
            ...acc,
            [simpleKey]: diff[key].value,
          };
        case 'added':
          return {
            ...acc,
            [plusKey]: isObject(diff[key].value)
              ? parseInnerValue(diff[key].value, indent + 4) : diff[key].value,
          };
        case 'removed':
          return {
            ...acc,
            [minusKey]: isObject(diff[key].value)
              ? parseInnerValue(diff[key].value, indent + 4) : diff[key].value,
          };
        case 'changed':
          return {
            ...acc,
            [minusKey]: isObject(diff[key].valueBefore)
              ? parseInnerValue(diff[key].valueBefore, indent + 4) : diff[key].valueBefore,
            [plusKey]: isObject(diff[key].valueAfter)
              ? parseInnerValue(diff[key].valueAfter, indent + 4) : diff[key].valueAfter,
          };
        default: return {
          ...acc,
          [simpleKeyDeep]: parseDiff(diff[key], indent + 4),
        };
      }
    }, {});
  const calculatedDiff = getDiff(base, parsedFile1, parsedFile2);
  console.log('calculatedDiff');
  console.log(stringify(parseDiff(calculatedDiff), 1));
  return stringify(parseDiff(calculatedDiff), 2);
};

export default (file1, file2) => compare(file1, file2);
