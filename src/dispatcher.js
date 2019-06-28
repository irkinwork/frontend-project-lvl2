export default (status, list) => list.find(({ type }) => type === status);
