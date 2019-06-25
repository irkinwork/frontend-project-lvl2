import { isObject } from 'lodash';

const renderValue = (value) => {
  const renderedValue = isObject(value) ? '[complex value]' : value;
  return renderedValue;
};

const renderPlainDiff = (diff, pathConfig) => Object.keys(diff)
  .reduce((acc, key) => {
    const newPath = pathConfig ? `${pathConfig}.${key}` : `${key}`;
    switch (diff[key].status) {
      case 'unchanged':
        return `${acc}`;
      case 'added':
        return `${acc}Property '${newPath}' was added with value: ${renderValue(diff[key].value)}\n`;
      case 'removed':
        return `${acc}Property '${newPath}' was removed\n`;
      case 'changed':
        return `${acc}Property '${newPath}' was changed from '${renderValue(diff[key].valueBefore)}' to '${renderValue(diff[key].valueAfter)}'\n`;
      default: return `${acc}${renderPlainDiff(diff[key], newPath)}`;
    }
  }, '');

export default renderPlainDiff;
