const { isPlainObject } = require('lodash');

/**
 * getValue by key
 *
 * @param {string} key
 * @param {Cart} cart
 *
 * @returns {any}
 */
const getValue = (key, cart) => {
  const path = key.split('.');
  const value = path.reduce((acc, subKey) => {
    if (!acc) return undefined;

    if (!Array.isArray(acc)) {
      return acc[subKey];
    }

    return acc.map((it) => it && it[subKey]).filter(Boolean);
  }, cart);

  return value;
};

const formatConditions = (rule) => {
  return Object.entries(rule).map(([k, v]) => ({ [k]: v }));
};

const splitCondition = (condition) => {
  // FIXME: can get rid of lodash with typescript
  const isEq = !isPlainObject(condition);

  const operator = isEq ? 'eq' : Object.keys(condition).at(0);
  const rule = isEq ? condition : condition[operator];

  return [operator, rule];
};

const checkSimpleCondition = (value, func) => {
  return Array.isArray(value) ? value.some(func) : func(value);
};

module.exports = {
  getValue,
  formatConditions,
  splitCondition,
  checkSimpleCondition,
};
