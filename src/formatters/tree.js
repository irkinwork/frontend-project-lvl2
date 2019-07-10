import { isObject, flatten } from 'lodash';

const initialIndent = 2;
const extraIndent = 4;
const addWhiteSpaces = (depth, initial) => `${' '.repeat(initial + depth * extraIndent)}`;

const renderInnerValue = (value, depth) => Object.keys(value)
  .reduce((acc, key) => {
    const whiteSpaces = addWhiteSpaces(depth, initialIndent);
    const endingWhiteSpaces = `${addWhiteSpaces(depth, 0)}`;
    const indentedKey = `${whiteSpaces}  ${key}`;
    return isObject(value[key])
      ? flatten([...acc, `${indentedKey}: {`, `${renderInnerValue(value[key], depth + 1).join('\n')}}`, `${endingWhiteSpaces}`])
      : flatten([...acc, `${indentedKey}: ${value[key]}`, `${endingWhiteSpaces}`]);
  }, []);

const stringify = (key, value, depth) => `${key}: ${isObject(value)
  ? `{\n${renderInnerValue(value, depth + 1).join('\n')}}`
  : value}`;

const typesTree = {
  unchanged: (node, whiteSpaces, depth) => {
    const { name: key, value } = node;
    const simpleKey = `${whiteSpaces}  ${key}`;
    return stringify(simpleKey, value, depth);
  },
  added: (node, whiteSpaces, depth) => {
    const { name: key, value } = node;
    const plusKey = `${whiteSpaces}+ ${key}`;
    return stringify(plusKey, value, depth);
  },
  removed: (node, whiteSpaces, depth) => {
    const { name: key, value } = node;
    const minusKey = `${whiteSpaces}- ${key}`;
    return stringify(minusKey, value, depth);
  },
  changed: (node, whiteSpaces, depth) => {
    const { name: key, valueBefore, valueAfter } = node;
    const plusKey = `${whiteSpaces}+ ${key}`;
    const minusKey = `${whiteSpaces}- ${key}`;
    return [`${stringify(minusKey, valueBefore, depth)}`, `${stringify(plusKey, valueAfter, depth)}`];
  },
  nested: (node, whiteSpaces, depth, render) => {
    const { name: key, children } = node;
    const simpleKey = `${whiteSpaces}  ${key}`;
    return [`${simpleKey}: {`, `${render(children, depth + 1).join('\n')}`, `${whiteSpaces}  }`];
  },
};

const renderTreeDiff = (diff, depth = 0) => diff
  .reduce((acc, node) => {
    const { type } = node;
    const whiteSpaces = addWhiteSpaces(depth, initialIndent);
    const returnValue = typesTree[type];
    return flatten([...acc, returnValue(node, whiteSpaces, depth, renderTreeDiff)]);
  }, []);

export default diff => `{\n${renderTreeDiff(diff).join('\n')}\n}`;
