import renderTreeDiff from './tree';
import renderPlainDiff from './plain';
import renderJSONDiff from './json';

const renderersTree = {
  plain: diff => renderPlainDiff(diff),
  tree: diff => renderTreeDiff(diff),
  json: diff => renderJSONDiff(diff),
};

export default (diff, format) => {
  const render = renderersTree[format];
  return render(diff, format);
};
