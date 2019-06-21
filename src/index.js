import fs from 'fs';
import path from 'path';
import { has, isObject } from 'lodash';
import parsers from './parsers';

const readFile = fileConfig => fs.readFileSync(path.resolve(process.cwd(), fileConfig), 'utf-8');
const indentValue = 4;
const extraIndentValue = 2;
const compare = (firstConfig, secondConfig) => {
  const file1 = readFile(firstConfig);
  const file2 = readFile(secondConfig);
  const parsedFile1 = parsers(firstConfig, file1);
  const parsedFile2 = parsers(secondConfig, file2);
  const getDiff = (data1, data2) => {
    const commonData = { ...data1, ...data2 };
    return Object.keys(commonData)
      .reduce((acc, key) => {
        if (isObject(data1[key]) && isObject(data2[key])) {
          return { ...acc, [key]: getDiff(data1[key], data2[key]) };
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
  };

  const parseInnerValue = (value, indent = indentValue) => Object.keys(value)
    .reduce((acc, key) => {
      const indentedKey = `${' '.repeat(indent)}${key}`;
      return isObject(value[key])
        ? { ...acc, [indentedKey]: parseInnerValue(value[key], indent + indentValue) }
        : { ...acc, [indentedKey]: value[key] };
    }, {});

  const parseDiff = (diff, indent = 0) => Object.keys(diff)
    .reduce((acc, key) => {
      const plusKey = `+ ${key}`;
      const minusKey = `- ${key}`;
      const simpleKey = `  ${key}`;
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
              ? parseInnerValue(diff[key].value, indent + extraIndentValue) : diff[key].value,
          };
        case 'removed':
          return {
            ...acc,
            [minusKey]: isObject(diff[key].value)
              ? parseInnerValue(diff[key].value, indent + extraIndentValue) : diff[key].value,
          };
        case 'changed':
          return {
            ...acc,
            [minusKey]: isObject(diff[key].valueBefore)
              ? parseInnerValue(diff[key].valueBefore, indent + extraIndentValue) : diff[key].valueBefore,
            [plusKey]: isObject(diff[key].valueAfter)
              ? parseInnerValue(diff[key].valueAfter, indent + extraIndentValue) : diff[key].valueAfter,
          };
        default: return {
          ...acc,
          [simpleKey]: parseDiff(diff[key]),
        };
      }
    }, {});
  const stringify = (diff, whitespace = extraIndentValue) => {
    const iter = (tree, indent) => Object.keys(tree).reduce((acc, key) => {
      const whiteSpaces = `${' '.repeat(indent)}`;
      const extraWhiteSpaces = `${' '.repeat(indent + whitespace)}`;
      if (isObject(tree[key])) {
        return `${acc}\n${whiteSpaces}${key}: {${iter(tree[key], indent + indentValue)}\n${extraWhiteSpaces}}`;
      }
      return `${acc}\n${whiteSpaces}${key}: ${tree[key]}`;
    }, '');

    return `{${iter(diff, whitespace)}\n}`;
  };
  const calculatedDiff = getDiff(parsedFile1, parsedFile2);
  return stringify(parseDiff(calculatedDiff));
};

export default (file1, file2) => compare(file1, file2);
