import { isObject, has } from 'lodash';

const renderValue = (value) => {
  const renderedValue = isObject(value) ? '[complex value]' : value;
  return renderedValue;
};

const renderPlainDiff = (diff, pathConfig) => diff
  .reduce((acc, node) => {
    const newPath = pathConfig ? `${pathConfig}.${node.name}` : `${node.name}`;
    if (has(node, 'children')) {
      return `${acc}${renderPlainDiff(node.children, newPath)}`;
    }
    switch (node.type) {
      case 'unchanged':
        return `${acc}`;
      case 'added':
        return `${acc}Property '${newPath}' was added with value: ${renderValue(node.value)}\n`;
      case 'removed':
        return `${acc}Property '${newPath}' was removed\n`;
      case 'changed':
        return `${acc}Property '${newPath}' was changed from '${renderValue(node.value.before)}' to '${renderValue(node.value.after)}'\n`;
      default: return `${acc}${renderPlainDiff(node, newPath)}`;
    }
  }, '');

export default renderPlainDiff;
