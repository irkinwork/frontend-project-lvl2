import { isObject } from 'lodash';

const initialIndent = 2;
const extraIndent = 4;
const addWhiteSpaces = (deep, initial) => `\n${' '.repeat(initial + deep * extraIndent)}`;

const renderInnerValue = (value, deep) => Object.keys(value)
  .reduce((acc, key) => {
    const whiteSpaces = addWhiteSpaces(deep, initialIndent);
    const endingWhiteSpaces = addWhiteSpaces(deep, 0);
    const indentedKey = `${whiteSpaces}  ${key}`;
    return isObject(value[key])
      ? `${acc}${indentedKey}: ${renderInnerValue(value[key], deep + 1)}${endingWhiteSpaces}`
      : `${acc}${indentedKey}: ${value[key]}${endingWhiteSpaces}`;
  }, '');

const typesTree = {
  unchanged: (node, whiteSpaces) => {
    const { name: key, value } = node;
    const simpleKey = `${whiteSpaces}  ${key}`;
    const returnedValue = `${simpleKey}: ${value}`;
    return returnedValue;
  },
  added: (node, whiteSpaces, deep) => {
    const { name: key, value } = node;
    const plusKey = `${whiteSpaces}+ ${key}`;
    const returnedValue = `${plusKey}: ${isObject(value)
      ? `{${renderInnerValue(value, deep + 1)}}`
      : value}`;
    return returnedValue;
  },
  removed: (node, whiteSpaces, deep) => {
    const { name: key, value } = node;
    const minusKey = `${whiteSpaces}- ${key}`;
    const returnedValue = `${minusKey}: ${isObject(value)
      ? `{${renderInnerValue(value, deep + 1)}}`
      : value}`;
    return returnedValue;
  },
  changed: (node, whiteSpaces, deep) => {
    const { name: key, valueBefore, valueAfter } = node;
    const plusKey = `${whiteSpaces}+ ${key}`;
    const minusKey = `${whiteSpaces}- ${key}`;
    const returnedValue = `${minusKey}: ${isObject(valueBefore)
      ? `{${renderInnerValue(valueBefore, deep + 1)}}`
      : valueBefore}${plusKey}: ${isObject(valueAfter)
      ? `{${renderInnerValue(valueAfter, deep + 1)}}`
      : valueAfter}`;
    return returnedValue;
  },
  nested: (node, whiteSpaces, deep, render) => {
    const { name: key, children } = node;
    const simpleKey = `${whiteSpaces}  ${key}`;
    const returnedValue = `${simpleKey}: {${render(children, deep + 1)}${whiteSpaces}  }`;
    return returnedValue;
  },
};

const renderTreeDiff = (diff, deep = 0) => diff
  .reduce((acc, node) => {
    const { type } = node;
    const whiteSpaces = addWhiteSpaces(deep, initialIndent);
    const returnValue = typesTree[type];
    const result = `${acc}${returnValue(node, whiteSpaces, deep, renderTreeDiff)}`;
    return result;
  }, '');

export default diff => `{${renderTreeDiff(diff)}\n}`;
