const { isNullOrUndefinedNotZero, isEqual } = require("./helpers");


class EligibilityService {
  getValueFromCart(cart, key) {
    // Split the key by '.' to handle nested objects
    const keys = key.split(".");
    let value = cart;

    // Traverse through the keys to get the nested value
    for (const k of keys) {
      const isIndex = /^\d+$/.test(k);
      // Handle arrays if the key is an index
      if (Array.isArray(value) && isIndex) {
        value = value[parseInt(k)];
      } else {
        value = value[k];
      }
      if (isNullOrUndefinedNotZero(value)) return null;
    }
    return value;
  }

  validateCriteria({ cart, condition, key }) {
    const cartValue = this.getValueFromCart(cart, key);


    const CONDITION_CHECK_METHODS = {
      eq: ({ value, _condition }) => value === _condition.eq,
      gt: ({ value, _condition }) => value > _condition.gt,
      lt: ({ value, _condition }) => value < _condition.lt,
      gte: ({ value, _condition }) => value >= _condition.gte,
      lte: ({ value, _condition }) => value <= _condition.lte,
      in: ({ value, _condition }) => _condition.in.includes(value),
      and: ({ value, _condition }) =>
        this.validateCriteria({ cart, key, condition: _condition.and }),
      or: ({ value, _condition }) => {
        return Object.keys(_condition.or).some((subConditionKey) => {
          return this.validateCriteria({
            cart,
            key,
            condition: { [subConditionKey]: _condition.or[subConditionKey] },
          });
        });
      },
    };

    if (typeof condition !== "object") {

      if (!isEqual(cartValue, condition)) return false;
      return true;
    }

    for (const conditionKey in condition) {
      if (!(conditionKey in CONDITION_CHECK_METHODS)) {
        throw new Error(`That condition has not been implemented: ${conditionKey}`);
      }

      const conditionCheckMethod = CONDITION_CHECK_METHODS[conditionKey];

      const isConditionCheck = conditionCheckMethod({
        value: cartValue,
        _condition: condition,
      });

      if (!isConditionCheck) {
        return false;
      }
    }

    return true;
  }
  /**
   * Compare cart data with criteria to compute eligibility.
   * If all criteria are fulfilled then the cart is eligible (return true).
   *
   * @param cart
   * @param criteria
   * @return {boolean}
   */
  isEligible(cart, criteria) {
    for (const key in criteria) {
      const condition = criteria[key];
      if (!this.validateCriteria({ cart, condition, key })) {
        return false;
      }
    }

    return true;
  }
}

module.exports = {
  EligibilityService,
};
