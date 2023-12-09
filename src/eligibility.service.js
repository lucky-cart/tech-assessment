class EligibilityService {
  #isConditionFulfilled(object, path, condition) {
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
    return Object.entries(criteria).every(([key, condition]) =>
      this.#isConditionFulfilled(cart, key.split("."), condition)
    );
  }
}

module.exports = {
  EligibilityService,
};
