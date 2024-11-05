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
    // TODO: compute cart eligibility here.
    return Object.entries(criteria).every(([key, condition]) => {
      const cartValue = this.getCartValue(cart, key);
      return this.matchesCondition(cartValue, condition);
    });
  }

  /**
   * Get value from cart using dot notation for nested properties
   * @param {Object} cart
   * @param {string} key
   * @returns {*}
   */
  getCartValue(cart, key) {
    const parts = key.split(".");
    let value = cart;

    for (const part of parts) {
      if (Array.isArray(value)) {
        return value.map((item) => item[part]);
      }
      if (!value || !(part in value)) return undefined;
      value = value[part];
    }
    return value;
  }

  /**
   * Check if cart value matches the condition
   * @param {*} cartValue
   * @param {*} condition
   * @returns {boolean}
   */
  matchesCondition(cartValue, condition) {
    // If the cart value is an array
    if (Array.isArray(cartValue)) {
      return cartValue.some((value) => {
        if (typeof condition === "object" && condition !== null) {
          if ("gt" in condition) return value > condition.gt;
          if ("lt" in condition) return value < condition.lt;
          if ("gte" in condition) return value >= condition.gte;
          if ("lte" in condition) return value <= condition.lte;
          if ("in" in condition) return condition.in.includes(String(value));
        }
        return String(value) === String(condition);
      });
    }

    // If the condition is an object
    if (typeof condition === "object" && condition !== null) {
      if ("gt" in condition) {
        return cartValue > condition.gt;
      }
      if ("lt" in condition) {
        return cartValue < condition.lt;
      }
      if ("gte" in condition) {
        return cartValue >= condition.gte;
      }
      if ("lte" in condition) {
        return cartValue <= condition.lte;
      }
      if ("in" in condition) {
        return condition.in.some(
          (value) => String(cartValue) === String(value)
        );
      }
      if ("and" in condition) {
        return Object.entries(condition.and).every(([key, value]) =>
          this.matchesCondition(cartValue, { [key]: value })
        );
      }
      if ("or" in condition) {
        return Object.entries(condition.or).some(([key, value]) =>
          this.matchesCondition(cartValue, { [key]: value })
        );
      }
    }

    return String(cartValue) === String(condition);
  }
}

module.exports = {
  EligibilityService,
};
