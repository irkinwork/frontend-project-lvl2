import { isObject, flattenDeep } from 'lodash';

const initialIndent = 2;
const extraIndent = 4;
const addIndents = (depth, initial) => `${' '.repeat(initial + depth * extraIndent)}`;

const renderInnerValue = (value, depth) => Object.keys(value)
  .reduce((acc, key) => {
    const indents = addIndents(depth, initialIndent);
    const indentedKey = `${indents}  ${key}`;
    return isObject(value[key])
      ? [acc, `${indentedKey}: {`, renderInnerValue(value[key], depth + 1), `  ${indents}}`]
      : [acc, `${indentedKey}: ${value[key]}`];
  }, []);

const stringify = (key, value, depth) => {
  const indents = addIndents(depth, initialIndent);
  if (isObject(value)) {
    return [`${key}: {`, renderInnerValue(value, depth + 1), `  ${indents}}`];
  }
  return `${key}: ${value}`;
};

const typesTree = {
  unchanged: (node, indents, depth) => {
    const { name: key, value } = node;
    const simpleKey = `${indents}  ${key}`;
    return stringify(simpleKey, value, depth);
  },
  added: (node, indents, depth) => {
    const { name: key, value } = node;
    const plusKey = `${indents}+ ${key}`;
    return stringify(plusKey, value, depth);
  },
  removed: (node, indents, depth) => {
    const { name: key, value } = node;
    const minusKey = `${indents}- ${key}`;
    return stringify(minusKey, value, depth);
  },
  changed: (node, indents, depth) => {
    const { name: key, valueBefore, valueAfter } = node;
    const plusKey = `${indents}+ ${key}`;
    const minusKey = `${indents}- ${key}`;
    return [stringify(minusKey, valueBefore, depth), stringify(plusKey, valueAfter, depth)];
  },
  nested: (node, indents, depth, render) => {
    const { name: key, children } = node;
    const simpleKey = `${indents}  ${key}`;
    return [`${simpleKey}: {`, render(children, depth + 1), `  ${indents}}`];
  },
};

const renderTreeDiff = (diff, depth = 0) => diff
  .reduce((acc, node) => {
    const { type } = node;
    const indents = addIndents(depth, initialIndent);
    const returnValue = typesTree[type];
    return flattenDeep([acc, returnValue(node, indents, depth, renderTreeDiff)]);
  }, []);

export default diff => `{\n${renderTreeDiff(diff).join('\n')}\n}`;
