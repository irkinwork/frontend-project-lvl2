import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parsersTree = {
  '.json': data => JSON.parse(data),
  '.yml': data => yaml.safeLoad(data),
  '.ini': data => ini.parse(data),
};

export default (pathName, data) => {
  const ext = path.extname(pathName);
  const parse = parsersTree[ext];
  return parse(data);
};
