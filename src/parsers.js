import path from 'path';
import yaml from 'js-yaml';

export default (filename, file) => {
  const ext = path.extname(filename);
  switch (ext) {
    case '.json': {
      return JSON.parse(file);
    }
    case '.yml': {
      return yaml.safeLoad(file);
    }
    default: return JSON.parse(file);
  }
};
