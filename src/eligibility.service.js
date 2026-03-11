const { resolveCriteria } = require('./parsing/path-resolver');
const { evaluateResolvedCriteria } = require('./rules/condition-matcher');

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
    if (!criteria || Object.keys(criteria).length === 0) {
      return true;
    }

    const resolvedCriteria = resolveCriteria(cart, criteria);
    const { failedFilters } = evaluateResolvedCriteria(resolvedCriteria);
    return failedFilters.length === 0;
  }
}

module.exports = {
  EligibilityService,
};
