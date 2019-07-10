import { isObject, flatten } from 'lodash';

const renderValue = (value) => {
  const renderedValue = isObject(value) ? '[complex value]' : value;
  return renderedValue;
};

const typesTree = {
  unchanged: () => [],
  added: (path, node) => `Property '${path}' was added with value: ${renderValue(node.value)}`,
  removed: path => `Property '${path}' was removed`,
  changed: (path, node) => `Property '${path}' was changed from '${renderValue(node.valueBefore)}' to '${renderValue(node.valueAfter)}'`,
  nested: (path, node, render) => render(node.children, path),
};

const renderPlainDiff = (diff, pathConfig) => diff
  .reduce((acc, node) => {
    const { name, type } = node;
    const newPath = pathConfig ? `${pathConfig}.${name}` : `${name}`;
    const returnValue = typesTree[type];
    return flatten([...acc, returnValue(newPath, node, renderPlainDiff)]);
  }, []);

export default diff => renderPlainDiff(diff).join('\n');
