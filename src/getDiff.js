import { has, isObject } from 'lodash';

const getDiff = (data1, data2) => {
  const commonData = { ...data1, ...data2 };
  return Object.keys(commonData)
    .reduce((acc, node) => {
      if (isObject(data1[node]) && isObject(data2[node])) {
        return [...acc, { name: node, children: getDiff(data1[node], data2[node]) }];
      }
      if (!has(data1, node)) {
        return [...acc, { name: node, type: 'added', value: commonData[node] }];
      }
      if (!has(data2, node)) {
        return [...acc, { name: node, type: 'removed', value: commonData[node] }];
      }
      if ((typeof data1[node] !== typeof data2[node])
      || (data1[node] !== data2[node])) {
        return [...acc, {
          name: node,
          type: 'changed',
          value: {
            before: data1[node],
            after: data2[node],
          },
        }];
      }
      return [...acc, { name: node, type: 'unchanged', value: commonData[node] }];
    }, []);
};

export default getDiff;
