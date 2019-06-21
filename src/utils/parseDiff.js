import { isObject } from 'lodash';

const indentValue = 4;
const extraIndentValue = 2;

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
            ? parseInnerValue(diff[key].valueBefore, indent + extraIndentValue)
            : diff[key].valueBefore,
          [plusKey]: isObject(diff[key].valueAfter)
            ? parseInnerValue(diff[key].valueAfter, indent + extraIndentValue)
            : diff[key].valueAfter,
        };
      default: return {
        ...acc,
        [simpleKey]: parseDiff(diff[key]),
      };
    }
  }, {});
export const stringify = (diff) => {
  const iter = (tree, indent) => Object.keys(tree).reduce((acc, key) => {
    const whiteSpaces = `${' '.repeat(indent)}`;
    const extraWhiteSpaces = `${' '.repeat(indent + extraIndentValue)}`;
    if (isObject(tree[key])) {
      return `${acc}\n${whiteSpaces}${key}: {${iter(tree[key], indent + indentValue)}\n${extraWhiteSpaces}}`;
    }
    return `${acc}\n${whiteSpaces}${key}: ${tree[key]}`;
  }, '');

  return `{${iter(diff, extraIndentValue)}\n}`;
};


export default parseDiff;
