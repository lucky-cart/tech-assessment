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
    const shopper = criteria.shopperId == cart.shopperId ? true : false;

    const totalAti = criteria.totalAti.gt < cart.totalAti ? true : false;

    const productId = Boolean(
      cart.products.find(
        (p) => p.productId == criteria["products.productId"]["in"]
      )
    );

    const date =
      new Date(criteria.date.and.gt) < new Date(cart.date) &&
      new Date(cart.date) < new Date(criteria.date.and.lt)
        ? true
        : false;

    if (shopper && totalAti && productId && date) return true;
    return false;
  }
}

module.exports = {
  EligibilityService,
};
