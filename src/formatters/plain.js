import { isObject } from 'lodash';
import getType from '../dispatcher';

const renderValue = (value) => {
  const renderedValue = isObject(value) ? '[complex value]' : value;
  return renderedValue;
};

const typesList = [
  {
    type: 'unchanged',
    returnValue: () => '',
  },
  {
    type: 'added',
    returnValue: (path, value) => `Property '${path}' was added with value: ${renderValue(value)}\n`,
  },
  {
    type: 'removed',
    returnValue: path => `Property '${path}' was removed\n`,
  },
  {
    type: 'changed',
    returnValue: (path, value) => `Property '${path}' was changed from '${renderValue(value.before)}' to '${renderValue(value.after)}'\n`,
  },
];

const renderPlainDiff = (diff, pathConfig) => diff
  .reduce((acc, node) => {
    const {
      name, type, value, children,
    } = node;
    const newPath = pathConfig ? `${pathConfig}.${name}` : `${name}`;
    if (type === 'nested') {
      return `${acc}${renderPlainDiff(children, newPath)}`;
    }
    const { returnValue } = getType(type, typesList);
    return `${acc}${returnValue(newPath, value)}`;
  }, '');

export default renderPlainDiff;
