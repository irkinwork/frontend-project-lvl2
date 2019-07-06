import yaml from 'js-yaml';
import ini from 'ini';

const parsersTree = {
  '.json': JSON.parse,
  '.yml': yaml.safeLoad,
  '.ini': ini.parse,
};

export default (data, ext) => {
  const parse = parsersTree[ext];
  return parse(data);
};
