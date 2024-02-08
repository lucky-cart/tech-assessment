const isEqual = (a, b) => {
  if (a === b) return true;
  if (Number(a) === Number(b)) return true;
  if (new Date(a) === new Date(b)) return true;
  return false;
};

const isNullOrUndefinedNotZero = (a) => !a && a !== 0;

module.exports = {
  isEqual,
  isNullOrUndefinedNotZero,
};
