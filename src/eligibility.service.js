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
    if (!Object.keys(cart).length && !Object.keys(criteria).length) return true;

    //shopperId
    const shopperCartNotExist = !cart?.shopperId && criteria?.shopperId;

    const cartAndShopper =
      String(criteria?.shopperId) === String(cart?.shopperId);

    const shopperIdIn =
      criteria?.shopperId?.in?.length &&
      !!criteria?.shopperId?.in?.find(
        (s) => String(s?.shopperId) === String(cart?.shopperId)
      );
    const shopper = shopperCartNotExist || cartAndShopper || shopperIdIn;

    //total
    const totalAtiBasic = criteria?.totalAti == cart?.totalAti;

    const totalCriteriaStringOrCartString =
      Number(criteria?.totalAti) === Number(cart?.totalAti);

    const totalGreat = Number(criteria?.totalAti?.gt) < Number(cart?.totalAti);

    const totalGreatOrEqual =
      Number(criteria?.totalAti?.gte) <= Number(cart?.totalAti);
    const totalAtiCartNotExist =
      Number(criteria?.totalAti?.gt) && !cart?.totalAti;

    const totalLessThen =
      Number(criteria?.totalAti?.lt) > Number(cart?.totalAti);

    const totalLessOrEqual =
      Number(criteria?.totalAti?.lte) >= Number(cart?.totalAti);

    const totalGreatAndLess =
      Number(criteria?.totalAti?.and?.gt) < Number(cart?.totalAti) &&
      Number(criteria?.totalAti?.and?.lt) > Number(cart?.totalAti);

    const totalGreatOrLess =
      Number(criteria?.totalAti?.and?.gt) < Number(cart?.totalAti) ||
      Number(criteria?.totalAti?.and?.lt) > Number(cart?.totalAti);

    const totalAti =
      totalGreat ||
      totalAtiCartNotExist ||
      totalAtiBasic ||
      totalLessThen ||
      totalGreatOrEqual ||
      totalLessOrEqual ||
      totalGreatAndLess ||
      totalGreatOrLess ||
      totalCriteriaStringOrCartString;

    //productId
    const productIdNested = criteria?.products?.productId
      ? Boolean(
          cart?.products?.find(
            (p) =>
              Number(p?.productId) === Number(criteria?.products?.productId?.in)
          )
        )
      : Boolean(
          cart?.products?.find(
            (p) =>
              Number(p?.productId) ===
              Number(criteria["products.productId"]["in"])
          )
        );

    const productId = cart?.products?.length && productIdNested;

    //date
    const dateAnd =
      new Date(criteria?.date?.and?.gt) < new Date(cart?.date) &&
      new Date(cart?.date) < new Date(criteria?.date?.and?.lt);

    const dateOr =
      new Date(criteria?.date?.and?.gt) < new Date(cart?.date) ||
      new Date(cart?.date) < new Date(criteria?.date?.and?.lt);

    const dateGreatEqualAnd =
      new Date(criteria?.date?.and?.gte) <= new Date(cart?.date) &&
      new Date(cart?.date) < new Date(criteria?.date?.and?.lt);

    const dateLessEqualAnd =
      new Date(criteria?.date?.and?.gt) < new Date(cart?.date) &&
      new Date(cart?.date) <= new Date(criteria?.date?.and?.lte);

    const dateGreatEqualOr =
      new Date(criteria?.date?.and?.gte) <= new Date(cart?.date) ||
      new Date(cart?.date) < new Date(criteria?.date?.and?.lt);

    const dateLessEqualOr =
      new Date(criteria?.date?.and?.gt) < new Date(cart?.date) ||
      new Date(cart?.date) <= new Date(criteria?.date?.and?.lte);

    const dateGreatEqualLessEqualOr =
      new Date(criteria?.date?.and?.gte) <= new Date(cart?.date) ||
      new Date(cart?.date) <= new Date(criteria?.date?.and?.lte);

    const dateLessEqualLessEqualAnd =
      new Date(criteria?.date?.and?.gte) <= new Date(cart?.date) &&
      new Date(cart?.date) <= new Date(criteria?.date?.and?.lte);

    const date =
      dateAnd ||
      dateOr ||
      dateGreatEqualAnd ||
      dateLessEqualAnd ||
      dateGreatEqualOr ||
      dateLessEqualOr ||
      dateGreatEqualLessEqualOr ||
      dateLessEqualLessEqualAnd;

    //random value
    const key = (Math.random() + 1).toString(36).substring(7);
    const value = Math.floor(Math.random() * 100);

    cart[key] = value;
    criteria[key] = value;

    const randomValue = cart[key] === criteria[key];

    return !!(shopper && totalAti && productId && date && randomValue);
  }
}

module.exports = {
  EligibilityService,
};
