import { isObject, flattenDeep } from 'lodash';

const initialIndent = 2;
const extraIndent = 4;
const addIndent = (depth, initial) => `${' '.repeat(initial + depth * extraIndent)}`;

const renderInnerValue = (value, depth) => Object.keys(value)
  .reduce((acc, key) => {
    const indent = addIndent(depth, initialIndent);
    const indentedKey = `${indent}  ${key}`;
    return isObject(value[key])
      ? [acc, `${indentedKey}: {`, renderInnerValue(value[key], depth + 1), `  ${indent}}`]
      : [acc, `${indentedKey}: ${value[key]}`];
  }, []);

const stringify = (key, value, depth) => {
  const indent = addIndent(depth, initialIndent);
  if (isObject(value)) {
    return [`${key}: {`, renderInnerValue(value, depth + 1), `  ${indent}}`];
  }
  return `${key}: ${value}`;
};

const typesTree = {
  unchanged: (node, indent, depth) => {
    const { name: key, value } = node;
    const simpleKey = `${indent}  ${key}`;
    return stringify(simpleKey, value, depth);
  },
  added: (node, indent, depth) => {
    const { name: key, value } = node;
    const plusKey = `${indent}+ ${key}`;
    return stringify(plusKey, value, depth);
  },
  removed: (node, indent, depth) => {
    const { name: key, value } = node;
    const minusKey = `${indent}- ${key}`;
    return stringify(minusKey, value, depth);
  },
  changed: (node, indent, depth) => {
    const { name: key, valueBefore, valueAfter } = node;
    const plusKey = `${indent}+ ${key}`;
    const minusKey = `${indent}- ${key}`;
    return [stringify(minusKey, valueBefore, depth), stringify(plusKey, valueAfter, depth)];
  },
  nested: (node, indent, depth, render) => {
    const { name: key, children } = node;
    const simpleKey = `${indent}  ${key}`;
    return [`${simpleKey}: {`, render(children, depth + 1), `  ${indent}}`];
  },
};

const renderTreeDiff = (diff, depth = 0) => diff
  .map((node) => {
    const { type } = node;
    const indent = addIndent(depth, initialIndent);
    const returnValue = typesTree[type];
    return returnValue(node, indent, depth, renderTreeDiff);
  });

export default diff => `{\n${flattenDeep(renderTreeDiff(diff)).join('\n')}\n}`;
