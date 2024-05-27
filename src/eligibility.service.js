class EligibilityService {
  _defineEligibility(value, condition) {
    if (typeof condition === 'object') {
      for (const [key, keyValue] of Object.entries(condition)) {
        switch (key) {
          case 'gt':
            if (!(value > keyValue)) return false;
            break;
          case 'lt':
            if (!(value < keyValue)) return false;
            break;
          case 'gte':
            if (!(value >= keyValue)) return false;
            break;
          case 'lte':
            if (!(value <= keyValue)) return false;
            break;
          case 'in':
            if (!keyValue.includes(value)) return false;
            break;
          case 'and':
            if (!Object.entries(keyValue).every(([op, val]) => this._defineEligibility(value, { [op]: val })))
              return false;
            break;
          case 'or':
            if (!Object.entries(keyValue).some(([op, val]) => this._defineEligibility(value, { [op]: val })))
              return false;
            break;
          default:
            return false;
        }
      }
      return true;
    }
    return value == condition; /* exclude type compare */
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
    for (const [key, condition] of Object.entries(criteria)) {
      const keys = key.split('.');
      let cartValue = cart;

      for (const k of keys) {
        if (cartValue === undefined)
          return false;

        if (Array.isArray(cartValue)) {
          if (!cartValue.some(item => this._defineEligibility(item[k], condition)))
            return false;
          cartValue = cartValue.map(cartVal => cartVal[k]);
        } else {
          cartValue = cartValue[k];
        }
      }
      if (!Array.isArray(cartValue) && !this._defineEligibility(cartValue, condition))
        return false;
    }
    return true;
  }
}

module.exports = {
  EligibilityService,
};