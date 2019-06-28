import { isObject, has } from 'lodash';
import getType from './../dispatcher';

const indentValue = 4;
const extraIndentValue = 2;

const renderInnerValue = (value, indent = indentValue) => Object.keys(value)
  .reduce((acc, key) => {
    const indentedKey = `${' '.repeat(indent)}${key}`;
    return isObject(value[key])
      ? { ...acc, [indentedKey]: renderInnerValue(value[key], indent + indentValue) }
      : { ...acc, [indentedKey]: value[key] };
  }, {});

const typesList = [
  {
    type: 'unchanged',
    returnValue: (value, key) => {
      const simpleKey = `  ${key}`;
      const returnedValue = { [simpleKey]: value };
      return returnedValue;
    },
  },
  {
    type: 'added',
    returnValue: (value, key, indent) => {
      const plusKey = `+ ${key}`;
      const returnedValue = {
        [plusKey]: isObject(value)
          ? renderInnerValue(value, indent + extraIndentValue) : value,
      };
      return returnedValue;
    },
  },
  {
    type: 'removed',
    returnValue: (value, key, indent) => {
      const minusKey = `- ${key}`;
      const returnedValue = {
        [minusKey]: isObject(value)
          ? renderInnerValue(value, indent + extraIndentValue) : value,
      };
      return returnedValue;
    },
  },
  {
    type: 'changed',
    returnValue: (value, key, indent) => {
      const plusKey = `+ ${key}`;
      const minusKey = `- ${key}`;
      const returnedValue = {
        [minusKey]: isObject(value.before)
          ? renderInnerValue(value.before, indent + extraIndentValue)
          : value.before,
        [plusKey]: isObject(value.after)
          ? renderInnerValue(value.after, indent + extraIndentValue)
          : value.after,
      };
      return returnedValue;
    },
  },
];

const renderTreeDiff = (diff, indent = 0) => diff
  .reduce((acc, node) => {
    const { name, value, type } = node;
    const plusKey = `+ ${name}`;
    const minusKey = `- ${name}`;
    const simpleKey = `  ${name}`;
    if (has(node, 'children')) {
      return { ...acc, [simpleKey]: renderTreeDiff(node.children) };
    }
    const { returnValue } = getType(type, typesList);
    // console.log({ ...acc, ...returnValue(value, name, indent) });
    return { ...acc, ...returnValue(value, name, indent) };
    switch (type) {
      case 'unchanged':
        return {
          ...acc,
          [simpleKey]: value,
        };
      case 'added':
        return {
          ...acc,
          [plusKey]: isObject(value)
            ? renderInnerValue(value, indent + extraIndentValue) : value,
        };
      case 'removed':
        return {
          ...acc,
          [minusKey]: isObject(value)
            ? renderInnerValue(value, indent + extraIndentValue) : value,
        };
      case 'changed':
        return {
          ...acc,
          [minusKey]: isObject(value.before)
            ? renderInnerValue(value.before, indent + extraIndentValue)
            : value.before,
          [plusKey]: isObject(value.after)
            ? renderInnerValue(value.after, indent + extraIndentValue)
            : value.after,
        };
      default: break;
    }
    return acc;
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
