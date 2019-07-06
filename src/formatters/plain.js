import { isObject } from 'lodash';

const renderValue = (value) => {
  const renderedValue = isObject(value) ? '[complex value]' : value;
  return renderedValue;
};

const typesTree = {
  unchanged: () => '',
  added: (path, node) => `Property '${path}' was added with value: ${renderValue(node.value)}\n`,
  removed: path => `Property '${path}' was removed\n`,
  changed: (path, node) => `Property '${path}' was changed from '${renderValue(node.valueBefore)}' to '${renderValue(node.valueAfter)}'\n`,
  nested: (path, node, render) => `${render(node.children, path)}`,
};

const renderPlainDiff = (diff, pathConfig) => diff
  .reduce((acc, node) => {
    const { name, type } = node;
    const newPath = pathConfig ? `${pathConfig}.${name}` : `${name}`;
    const returnValue = typesTree[type];
    return `${acc}${returnValue(newPath, node, renderPlainDiff)}`;
  }, '');

export default renderPlainDiff;
