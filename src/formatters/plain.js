import { isObject } from 'lodash';

const renderValue = (value) => {
  const renderedValue = isObject(value) ? '[complex value]' : value;
  return renderedValue;
};

const typesTree = {
  unchanged: () => '',
  added: (path, value) => `Property '${path}' was added with value: ${renderValue(value)}\n`,
  removed: path => `Property '${path}' was removed\n`,
  changed: (path, value) => `Property '${path}' was changed from '${renderValue(value.before)}' to '${renderValue(value.after)}'\n`,
};

const renderPlainDiff = (diff, pathConfig) => diff
  .reduce((acc, node) => {
    const {
      name, type, value, children,
    } = node;
    const newPath = pathConfig ? `${pathConfig}.${name}` : `${name}`;
    if (type === 'nested') {
      return `${acc}${renderPlainDiff(children, newPath)}`;
    }
    const returnValue = typesTree[type];
    return `${acc}${returnValue(newPath, value)}`;
  }, '');

export default renderPlainDiff;
