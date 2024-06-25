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
      this.getCartValue(cart, key);
    }

    return false;
  }

  getCartValue(cart, key) {
    const keys = key.split(".");

    let value = cart;

    for (const key of keys) {
      if (Array.isArray(value)) {
        // products array
        value = value.map((item) => item[key]);
      } else if (typeof value === "object" && value !== null) {
        // other simple attributes
        value = value[key];
      } else {
        throw new Error("Should not happen ?");
        // TODO: ensure should not happen =)
      }
    }

    console.log({ keys, value });
    return value;
  }
}

module.exports = {
  EligibilityService,
};
