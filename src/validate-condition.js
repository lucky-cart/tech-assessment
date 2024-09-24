const {
  formatConditions,
  splitCondition,
  checkSimpleCondition,
} = require('./helpers');

const validateCondition = (condition, value) => {
  const [operator, rule] = splitCondition(condition);

  return ValidatorFactory.getValidator(operator).validate(rule, value);
};

class ValidatorFactory {
  static getValidator(operator) {
    const validationClasses = {
      eq: SimpleConditionValidator,
      in: SimpleConditionValidator,
      gt: SimpleConditionValidator,
      gte: SimpleConditionValidator,
      lt: SimpleConditionValidator,
      lte: SimpleConditionValidator,
      and: MultiConditionValidator,
      or: MultiConditionValidator,
    };

    const ValidationClass = validationClasses[operator];

    return new ValidationClass(operator);
  }
}

class BaseConditionValidator {
  constructor(operator) {
    this.operator = operator;
  }

  getOperations(cond, value) {}

  validate(cond, value) {
    return this.getOperations(cond, value)[this.operator]();
  }
}

class SimpleConditionValidator extends BaseConditionValidator {
  constructor(operator) {
    super(operator || 'eq');
  }

  getOperations(cond, value) {
    return {
      eq() {
        return checkSimpleCondition(
          value,
          (v) => v === cond || v?.toString() === cond?.toString(),
        );
      },
      in() {
        return checkSimpleCondition(value, (v) => cond.includes(v));
      },
      gt() {
        return checkSimpleCondition(value, (v) => v > cond);
      },
      gte() {
        return checkSimpleCondition(value, (v) => v >= cond);
      },
      lt() {
        return checkSimpleCondition(value, (v) => v < cond);
      },
      lte() {
        return checkSimpleCondition(value, (v) => v <= cond);
      },
    };
  }
}

class MultiConditionValidator extends BaseConditionValidator {
  constructor(operator) {
    super(operator);
  }

  getOperations(conditions, value) {
    return {
      or() {
        return formatConditions(conditions).some((condition) =>
          validateCondition(condition, value),
        );
      },
      and() {
        return formatConditions(conditions).every((condition) =>
          validateCondition(condition, value),
        );
      },
    };
  }
}

module.exports = validateCondition;
