import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

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

const getParser = ext => parsersList.find(({ type }) => type === ext);

export default (filename, file) => {
  const ext = path.extname(filename);
  const { parse } = getParser(ext, file);
  return parse(file);
};
