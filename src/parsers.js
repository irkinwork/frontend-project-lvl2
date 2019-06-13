import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

export default (filename, file) => {
  const ext = path.extname(filename);
  switch (ext) {
    case '.json': {
      return JSON.parse(file);
    }
    case '.yml': {
      return yaml.safeLoad(file);
    }
    case '.ini': {
      return ini.parse(file);
    }
    default: return JSON.parse(file);
  }
};
