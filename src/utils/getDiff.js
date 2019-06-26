import { has, isObject } from 'lodash';

const getDiff = (data1, data2) => {
  const commonData = { ...data1, ...data2 };
  return Object.keys(commonData)
    .reduce((acc, key) => {
      if (isObject(data1[key]) && isObject(data2[key])) {
        return { ...acc, [key]: getDiff(data1[key], data2[key]) };
      }
      if (!has(data1, key)) {
        return { ...acc, [key]: { status: 'added', value: commonData[key] } };
      }
      if (!has(data2, key)) {
        return { ...acc, [key]: { status: 'removed', value: commonData[key] } };
      }
      if (typeof data1[key] !== typeof data2[key]) {
        return {
          ...acc,
          [key]: {
            status: 'changed',
            valueBefore: data1[key],
            valueAfter: data2[key],
          },
        };
      }
      if (data1[key] !== data2[key]) {
        return { ...acc, [key]: { status: 'changed', valueBefore: data1[key], valueAfter: data2[key] } };
      }
      return { ...acc, [key]: { status: 'unchanged', value: commonData[key] } };
    }, {});
};

const initialAcc = {
  changed: [], unchanged: [], added: [], removed: [],
};
export const getDiff2 = (data1, data2, path = '', acc2 = initialAcc) => {
  const commonData = { ...data1, ...data2 };
  return Object.keys(commonData)
    .reduce((acc, key) => {
      const newPath = path ? `${path}.${key}` : `${key}`;
      if (isObject(data1[key]) && isObject(data2[key])) {
        return getDiff2(data1[key], data2[key], newPath, acc);
      }
      if (!has(data1, key)) {
        return {
          ...acc,
          added: acc.added.concat({
            path: newPath,
            value: commonData[key],
          }),
        };
      }
      if (!has(data2, key)) {
        return {
          ...acc,
          removed: acc.removed.concat({
            path: newPath,
            value: commonData[key],
          }),
        };
      }
      if ((typeof data1[key] !== typeof data2[key])
      || data1[key] !== data2[key]) {
        return {
          ...acc,
          changed: acc.changed.concat({
            path: newPath,
            valueBefore: data1[key],
            valueAfter: data2[key],
          }),
        };
      }
      return {
        ...acc,
        unchanged: acc.unchanged.concat({
          path: newPath,
          value: commonData[key],
        }),
      };
    }, acc2);
};
export default getDiff;
