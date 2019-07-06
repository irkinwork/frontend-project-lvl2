import {
  has, isObject, union, keys,
} from 'lodash';

const getDiff = (data1, data2) => {
  const commonKeys = union(keys(data1), keys(data2));
  return commonKeys
    .reduce((acc, node) => {
      if (isObject(data1[node]) && isObject(data2[node])) {
        return [...acc, { name: node, type: 'nested', children: getDiff(data1[node], data2[node]) }];
      }
      if (!has(data1, node)) {
        return [...acc, { name: node, type: 'added', value: data2[node] }];
      }
      if (!has(data2, node)) {
        return [...acc, { name: node, type: 'removed', value: data1[node] }];
      }
      if ((typeof data1[node] !== typeof data2[node])
      || (data1[node] !== data2[node])) {
        return [...acc, {
          name: node,
          type: 'changed',
          valueBefore: data1[node],
          valueAfter: data2[node],
        }];
      }
      return [...acc, { name: node, type: 'unchanged', value: data1[node] }];
    }, []);
};

export default getDiff;
