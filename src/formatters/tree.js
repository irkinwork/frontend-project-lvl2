import { isObject } from 'lodash';

const initialIndent = 2;
const extraIndent = 4;
const addWhiteSpaces = (deep, initial) => `\n${' '.repeat(initial + deep * extraIndent)}`;

const renderInnerValue = (value, deep) => Object.keys(value)
  .reduce((acc, key) => {
    const whiteSpace = addWhiteSpaces(deep, initialIndent);
    const endingWhiteSpace = addWhiteSpaces(deep, 0);
    const indentedKey = `${whiteSpace}  ${key}`;
    return isObject(value[key])
      ? `${acc}${indentedKey}: ${renderInnerValue(value[key], deep + 1)}${endingWhiteSpace}`
      : `${acc}${indentedKey}: ${value[key]}${endingWhiteSpace}`;
  }, '');

const typesTree = {
  unchanged: (node, deep, whiteSpace) => {
    const { name: key, value } = node;
    const simpleKey = `${whiteSpace}  ${key}`;
    const returnedValue = `${simpleKey}: ${value}`;
    return returnedValue;
  },
  added: (node, deep, whiteSpace) => {
    const { name: key, value } = node;
    const plusKey = `${whiteSpace}+ ${key}`;
    const returnedValue = `${plusKey}: ${isObject(value)
      ? `{${renderInnerValue(value, deep + 1)}}`
      : value}`;
    return returnedValue;
  },
  removed: (node, deep, whiteSpace) => {
    const { name: key, value } = node;
    const minusKey = `${whiteSpace}- ${key}`;
    const returnedValue = `${minusKey}: ${isObject(value)
      ? `{${renderInnerValue(value, deep + 1)}}`
      : value}`;
    return returnedValue;
  },
  changed: (node, deep, whiteSpace) => {
    const { name: key, valueBefore, valueAfter } = node;
    const plusKey = `${whiteSpace}+ ${key}`;
    const minusKey = `${whiteSpace}- ${key}`;
    const returnedValue = `${minusKey}: ${isObject(valueBefore)
      ? `{${renderInnerValue(valueBefore, deep + 1)}}`
      : valueBefore}${plusKey}: ${isObject(valueAfter)
      ? `{${renderInnerValue(valueAfter, deep + 1)}}`
      : valueAfter}`;
    return returnedValue;
  },
  nested: (node, deep, whiteSpace, render) => {
    const { name: key, children } = node;
    const simpleKey = `${whiteSpace}  ${key}`;
    const returnedValue = `${simpleKey}: {${render(children, deep + 1)}${whiteSpace}  }`;
    return returnedValue;
  },
};

const renderTreeDiff = (diff, deep = 0) => diff
  .reduce((acc, node) => {
    const { type } = node;
    const whiteSpace = addWhiteSpaces(deep, initialIndent);
    const returnValue = typesTree[type];
    const result = `${acc}${returnValue(node, deep, whiteSpace, renderTreeDiff)}`;
    return result;
  }, '');

export default diff => `{${renderTreeDiff(diff)}\n}`;
