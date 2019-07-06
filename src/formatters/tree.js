import { isObject } from 'lodash';

const indentValue = 4;
const extraIndentValue = 2;

const renderInnerValue = (value, indent = indentValue) => Object.keys(value)
  .reduce((acc, key) => {
    const indentedKey = `${' '.repeat(indent)}${key}`;
    return isObject(value[key])
      ? { ...acc, [indentedKey]: renderInnerValue(value[key], indent + indentValue) }
      : { ...acc, [indentedKey]: value[key] };
  }, {});

const typesTree = {
  unchanged: (node) => {
    const { name: key, value } = node;
    const simpleKey = `  ${key}`;
    const returnedValue = { [simpleKey]: value };
    return returnedValue;
  },
  added: (node, indent) => {
    const { name: key, value } = node;
    const plusKey = `+ ${key}`;
    const returnedValue = {
      [plusKey]: isObject(value)
        ? renderInnerValue(value, indent + extraIndentValue) : value,
    };
    return returnedValue;
  },
  removed: (node, indent) => {
    const { name: key, value } = node;
    const minusKey = `- ${key}`;
    const returnedValue = {
      [minusKey]: isObject(value)
        ? renderInnerValue(value, indent + extraIndentValue) : value,
    };
    return returnedValue;
  },
  changed: (node, indent) => {
    const { name: key, valueBefore, valueAfter } = node;
    const plusKey = `+ ${key}`;
    const minusKey = `- ${key}`;
    const returnedValue = {
      [minusKey]: isObject(valueBefore)
        ? renderInnerValue(valueBefore, indent + extraIndentValue)
        : valueBefore,
      [plusKey]: isObject(valueAfter)
        ? renderInnerValue(valueAfter, indent + extraIndentValue)
        : valueAfter,
    };
    return returnedValue;
  },
  nested: (node, indent, render) => {
    const { name: key, children } = node;
    const simpleKey = `  ${key}`;
    const returnedValue = { [simpleKey]: render(children) };
    return returnedValue;
  },
};

const renderTreeDiff = (diff, indent = 0) => diff
  .reduce((acc, node) => {
    const { type } = node;
    const returnValue = typesTree[type];
    return { ...acc, ...returnValue(node, indent, renderTreeDiff) };
  }, {});

const stringify = (diff) => {
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


export default diff => stringify(renderTreeDiff(diff));
