const OPERATORS = new Set(['gt', 'lt', 'gte', 'lte', 'in', 'and', 'or']);

// Detect if condition is an operator object (gt/lt/gte/lte/in/and/or).
const isOperatorObject = (value) =>
  !!value &&
  typeof value === 'object' &&
  !Array.isArray(value) &&
  Object.keys(value).some((key) => OPERATORS.has(key));

// Evaluate one cart value against expected condition/operator.
const evaluateSingleValueCondition = (cartValue, expectedValue, conditionOperator) => {
  if (!conditionOperator) return cartValue == expectedValue;
  if (conditionOperator === 'gt') return cartValue > expectedValue;
  if (conditionOperator === 'lt') return cartValue < expectedValue;
  if (conditionOperator === 'gte') return cartValue >= expectedValue;
  if (conditionOperator === 'lte') return cartValue <= expectedValue;
  if (conditionOperator === 'in')
    return (
      Array.isArray(expectedValue) &&
      expectedValue.some((item) => cartValue == item)
    );
  return false;
};

// Return true if at least one cart value matches.
const hasAtLeastOneMatchingCartValue = (cartCandidateValues, expectedValue, conditionOperator) => {
  for (const cartValue of cartCandidateValues) {
    if (evaluateSingleValueCondition(cartValue, expectedValue, conditionOperator))
      return true;
  }
  return false;
};

// Match multiple operator entries with AND/OR behavior.
const evaluateAndOrConditionGroup = (cartCandidateValues, operatorBlock, logicalMode) => {
  if (!operatorBlock || typeof operatorBlock !== 'object') return false;
  const operatorEntries = Object.entries(operatorBlock);

  if (logicalMode === 'and') {
    return operatorEntries.every(([conditionOperator, expectedValue]) =>
      hasAtLeastOneMatchingCartValue(
        cartCandidateValues,
        expectedValue,
        conditionOperator
      )
    );
  }
  else if (logicalMode === 'or') {
    return operatorEntries.some(([conditionOperator, expectedValue]) =>
      hasAtLeastOneMatchingCartValue(
        cartCandidateValues,
        expectedValue,
        conditionOperator
      )
    );
  }

  return false;
};

// Evaluate one condition block against cart values.
const evaluateCriteriaCondition = (cartCandidateValues, criteriaCondition) => {
  if (!Array.isArray(cartCandidateValues) || cartCandidateValues.length === 0)
    return false;

  if (!isOperatorObject(criteriaCondition)) {
    return hasAtLeastOneMatchingCartValue(cartCandidateValues, criteriaCondition);
  }

  if (Object.prototype.hasOwnProperty.call(criteriaCondition, 'and'))
    return evaluateAndOrConditionGroup(cartCandidateValues, criteriaCondition.and, 'and');

  if (Object.prototype.hasOwnProperty.call(criteriaCondition, 'or'))
    return evaluateAndOrConditionGroup(cartCandidateValues, criteriaCondition.or, 'or');

  return evaluateAndOrConditionGroup(cartCandidateValues, criteriaCondition, 'and');
};

// Evaluate all resolved rules and return failed/success filters.
const evaluateResolvedCriteria = (resolvedCriteria) => {
  const failedFilters = [];
  const successFilters = [];

  for (const resolvedRule of resolvedCriteria) {
    if (!evaluateCriteriaCondition(resolvedRule.values, resolvedRule.condition)) {
      failedFilters.push({
        path: resolvedRule.path,
        condition: resolvedRule.condition,
        values: resolvedRule.values,
      });
      continue;
    }

    successFilters.push({
      path: resolvedRule.path,
      condition: resolvedRule.condition,
      values: resolvedRule.values,
    });
  }

  return { failedFilters, successFilters };
};

module.exports = {
  evaluateResolvedCriteria,
};
