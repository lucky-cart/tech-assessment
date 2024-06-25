class EligibilityService {
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
      const cartValue = this.getCartValue(cart, key);

      const condition = criteria[key];

      if (!this.isEligibleCondition(cartValue, condition)) {
        return false;
      }
    }

    return true;
  }

  getCartValue(cart, key) {
    const keys = key.split(".");

    let value = cart;

    for (const key of keys) {
      if (Array.isArray(value)) {
        value = value.map((item) => item[key]);
      } else if (typeof value === "object" && value !== null) {
        value = value[key];
      } else {
        throw new Error("Should not happen ?");
        // TODO: ensure should not happen =)
      }
    }

    return value;
  }

  isEligibleCondition(cartValue, condition) {
    console.log({ cartValue, condition });

    if (typeof condition === "object" && condition !== null) {
      // gt, lt, gte, lte, in, and, or
      for (const key in condition) {
        const conditionValue = condition[key];
        switch (key) {
          case "gt":
            if (cartValue <= conditionValue) return false;
            break;
          case "lt":
            if (cartValue >= conditionValue) return false;
            break;
          case "gte":
            if (cartValue < conditionValue) return false;
            break;
          case "lte":
            if (cartValue > conditionValue) return false;
            break;
          case "in":
            if (!conditionValue.includes(cartValue)) return false;
            break;
          // TODO: recursive call
          // case "and":
          //   break;
          // case "or":
          //   break;
          default:
            return false;
        }
      }
    } else {
      // Basic condition
      return cartValue == condition;
    }
  }
}

module.exports = {
  EligibilityService,
};
