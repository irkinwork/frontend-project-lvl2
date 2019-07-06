import renderTreeDiff from './tree';
import renderPlainDiff from './plain';
import renderJSONDiff from './json';

const renderersTree = {
  plain: renderPlainDiff,
  tree: renderTreeDiff,
  json: renderJSONDiff,
};

export default (diff, format) => {
  const render = renderersTree[format];
  return render(diff);
};
