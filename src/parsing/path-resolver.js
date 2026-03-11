// Resolve all cart values for a dot-notated path and keep a flat result.
const getValuesByPath = (obj, path) => {
  const parts = path.split('.');
  const isDefined = (value) => value !== undefined && value !== null;

  const readKey = (source, key) => {
    if (!isDefined(source)) return [];
    if (Array.isArray(source)) {
      return source
        .map((item) => (isDefined(item) ? item[key] : undefined))
        .filter(isDefined);
    }
    return isDefined(source[key]) ? [source[key]] : [];
  };

  let resolvedValues = [obj];
  for (const key of parts) {
    resolvedValues = resolvedValues.flatMap((source) => readKey(source, key));
  }

  return resolvedValues;
};

// Attach resolved cart values to each criteria entry.
const resolveCriteria = (cart, criteria) =>
  Object.entries(criteria).map(([path, condition]) => ({
    path,
    condition,
    values: getValuesByPath(cart, path),
  }));

module.exports = {
  getValuesByPath,
  resolveCriteria,
};
