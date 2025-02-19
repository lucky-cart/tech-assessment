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
    let objKeys = Object.keys(criteria);
    //No criteria case
    if (objKeys.length === 0)
      return true;
    for (const [key, value] of Object.entries(criteria)) {
      if (key.includes('.')) {
        let [subKey0, subKey1] = key.split('.');
        if (Object.keys(cart).length === 0)
          ///cart is empty
          return false;
        if (!cart[subKey0])
          //first level field not found
          return false;

        if (Array.isArray(cart[subKey0])) {
          //Array Case
          if (!cart[subKey0].some((obj) => this.compareValues(obj[subKey1], value))) {
            return false;
          }
        } else {
          //Object case
          if (!this.compareValues(cart[subKey0][subKey1], value)) {
            return false;
          }
        }

      } else {
        if (cart[key] === undefined) {
          //Key not found in cart
          return false;
        }

        if (!this.compareValues(cart[key], value)) {
          return false;
        }
      }

    }
    return true;
  }

  /**
   * Compare values between criteria and cart with operators. Using recursivity for 'and' and 'or' operators
   * If all criteria are fulfilled then the cart is eligible (return true).
   *
   * @param cartValue
   * @param criteriaValue
   * @return {boolean}
   */

  compareValues(cartValue, criteriaValue) {

    //Stop cases
    if (criteriaValue === null || criteriaValue === undefined) {
      return false;
    }

    if (typeof criteriaValue !== 'object') {
      return cartValue == criteriaValue;
    }

    //Handling operators
    const [operator, value] = Object.entries(criteriaValue)[0];
    switch (operator) {
      case 'gt':
        return cartValue > value;
      case 'lt':
        return cartValue < value;
      case 'gte':
        return cartValue >= value;
      case 'lte':
        return cartValue <= value;
      case 'in':
        return value.includes(cartValue);
      case 'and':
        return Object.entries(value).every(([op, val]) =>
          this.compareValues(cartValue, {
            [op]: val
          })
        );
      case 'or':
        return Object.entries(value).some(([op, val]) =>
          this.compareValues(cartValue, {
            [op]: val
          })
        );
      default:
        return false;
    }
  }
}



module.exports = {
  EligibilityService,
};