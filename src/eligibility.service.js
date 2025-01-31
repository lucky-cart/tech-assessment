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
    if (!cart || typeof cart !== 'object' || !criteria || typeof criteria !== 'object') {
      throw new Error("Invalid cart or criteria");
    }
    return Object.entries(criteria).every(([key, condition]) => {
      const cartValue = this.getCartValue(cart, key);
      return this.checkCondition(cartValue, condition);
    });
  }

  getCartValue(cart, key) {
    return key.split('.').reduce((obj, subObj) => {
      if (Array.isArray(obj)) {
        return obj.map(item => item[subObj]).filter(v => v !== undefined);
      }
      return obj ? obj?.[subObj] ?? null : null;
    }, cart);
  }

  checkCondition(cartValue, condition) {
    if (Array.isArray(cartValue)) {
      return cartValue.some(value => this.evaluateCondition(value, condition));
    }
    return this.evaluateCondition(cartValue, condition);
  }

  evaluateCondition(cartValue, condition) {
    if (typeof condition === 'object' && !Array.isArray(condition)) {
      return Object.entries(condition).every(([operator, value]) => {
        switch (operator) {
          case 'gt': return Number(cartValue) > Number(value);
          case 'lt': return Number(cartValue) < Number(value);
          case 'gte': return Number(cartValue) >= Number(value);
          case 'lte': return Number(cartValue) <= Number(value);
          case 'in': return Array.isArray(value) ? value.includes(cartValue) : false;       
          case 'and': return Object.entries(value).every(([subOp, subVal]) => this.evaluateCondition(cartValue, { [subOp]: subVal }));
          case 'or': return Object.entries(value).some(([subOp, subVal]) => this.evaluateCondition(cartValue, { [subOp]: subVal }));
          default: return false;
        }
      });
    }
    return String(cartValue) == String(condition);
  }
}

module.exports = {
  EligibilityService,
};
