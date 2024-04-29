class EligibilityService {

  isCriteriaVerified(concurrent, criteria) {
    if (typeof criteria === 'object') {
      if (criteria.gt && concurrent <= criteria.gt) {
        return false;
      }
      if (criteria.lt && concurrent >= criteria.lt) {
        return false;
      }
      if (criteria.gte && concurrent < criteria.gte) {
        return false;
      }
      if (criteria.lte && concurrent > criteria.lte) {
        return false;
      }
      if (criteria.in && !criteria.in.includes(concurrent)) {
        return false;
      }
      if (criteria.and && !Object.entries(criteria.and).every(([key, value]) => this.isCriteriaVerified(concurrent, { [key]: value }))) {
        return false;
      }
      if (criteria.or && !Object.entries(criteria.or).some(([key, value]) => this.isCriteriaVerified(concurrent, { [key]: value }))) {
        return false;
      }
    } else {
      if (concurrent != criteria) {
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
    for (let key in criteria) {
      const value = cart[key];
      // Check if the key refers to a sub object or array
      const subCriteria = key.split('.');
      if (value === undefined && subCriteria.length > 1) {
        for (let i = 0; i < subCriteria.length - 1; i++) {
          const subValue = cart[subCriteria[i]];
          const subKey = subCriteria[i + 1];
          // Check if the sub array is eligible
          if (!subValue || Array.isArray(subValue) && !subValue.some(v => this.isEligible(v, { [subKey]: criteria[key] }))) {
            return false;
          }
          // Check if the sub object is eligible
          else if (!Array.isArray(subValue) && !this.isEligible(subValue, { [subKey]: criteria[key] })) {
            return false;
          }
        }
        continue;
      } else if (value === undefined) {
        return false;
      }


      let condition = criteria[key];
      if (!this.isCriteriaVerified(value, condition)) {
        return false;
      }
    }
    return true;
  }
}


module.exports = {
  EligibilityService,
};
