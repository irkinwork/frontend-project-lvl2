import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import getParser from './dispatcher';

const parsersList = [
  {
    type: '.json',
    parse: file => JSON.parse(file),
  },
  {
    type: '.yml',
    parse: file => yaml.safeLoad(file),
  },
  {
    type: '.ini',
    parse: file => ini.parse(file),
  },
];

export default (filename, file) => {
  const ext = path.extname(filename);
  const { parse } = getParser(ext, parsersList);
  return parse(file);
};
