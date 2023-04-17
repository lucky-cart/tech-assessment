class EligibilityService {
  gt(value, criteria) {
    return value > criteria;
  }

  lt(value, criteria) {
    return value < criteria;
  }

  gte(value, criteria) {
    return value >= criteria;
  }

  lte(value, criteria) {
    return value <= criteria;
  }

  in(value, criteria) {
    return criteria.includes(value);
  }

  and(value, criteria) {
    return Object.entries(criteria)
      .map(([key, criteriaValue]) => {
        return this.runCondition(key, value, criteriaValue);
      })
      .every((v) => v === true);
  }

  or(value, criteria) {
    return Object.entries(criteria)
      .map(([key, criteriaValue]) => {
        return this.runCondition(key, value, criteriaValue);
      })
      .some((v) => v === true);
  }

  findCartValue(cart, value) {
    if (value.includes(".")) {
      return null;
    } else {
      return cart[value];
    }
  }

  runCondition(condition, cartValue, conditionValue) {
    if (typeof conditionValue === "object") {
      conditionValue = conditionValue[condition];
    }

    switch (condition) {
      case "gt":
        return this.gt(cartValue, conditionValue);
      case "lt":
        return this.lt(cartValue, conditionValue);
      case "gte":
        return this.gte(cartValue, conditionValue);
      case "lte":
        return this.lte(cartValue, conditionValue);
      case "in":
        return this.in(cartValue, conditionValue);
      case "and":
        return this.and(cartValue, conditionValue);
      case "or":
        return this.or(cartValue, conditionValue);
      default:
        return false;
    }
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
    return Object.entries(criteria)
      .map(([key, value]) => {
        if (key.includes(".")) {
          //TODO: handle sub condition
          console.log(key);
        }

        if (typeof value === "string" || typeof value === "number") {
          return value == cart[key];
        }

        const condition = Object.keys(value).shift();
        const cartValue = this.findCartValue(cart, key);

        return this.runCondition(condition, cartValue, value);
      })
      .every((v) => v === true);
  }
}

module.exports = {
  EligibilityService,
};
