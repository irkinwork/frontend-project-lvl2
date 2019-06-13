import fs from 'fs';
import path from 'path';
import {has} from 'lodash';

const compare = (firstConfig, secondConfig) => {
  const file1 = fs.readFileSync(path.resolve(process.cwd(), firstConfig));
  const file2 = fs.readFileSync(path.resolve(process.cwd(), secondConfig));
  const json1 = JSON.parse(file1);
  const json2 = JSON.parse(file2);
  const base = Object.keys(json1).length > Object.keys(json2).length ? json1 : json2;
  const difference = Object.keys(base).reduce((acc, item) => {
    if (!has(json2, item)) {
      return [...acc, `- ${item}: ${json1[item]}`];
    }
    if (json1[item] !== json2[item]) {
      return [...acc, `- ${item} : ${json1[item]}`, `+ ${item}: ${json2[item]}`];
    }
    return [...acc, `${item}: ${json1[item]}`];
  }, []);

  return difference.join('\n');
};

export default (file1, file2) => compare(file1, file2);
