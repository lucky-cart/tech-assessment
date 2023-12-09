class EligibilityService {
  #isScalarConditionFulfilled(scalar, condition) {
    if (typeof condition !== "object" || condition === null) {
      // Using ==, as indicated in the README.md
      return scalar == condition;
    }

    const entries = Object.entries(condition);

    if (entries.length !== 1) {
      throw new Error(
        "Wrong condition format. Use 'and', or 'or' to combine several statements in condition."
      );
    }

    const [operator, comparisonValue] = entries[0];
    switch (operator) {
      case "gt":
        return scalar > comparisonValue;
      case "lt":
        return scalar < comparisonValue;
      case "gte":
        return scalar >= comparisonValue;
      case "lte":
        return scalar <= comparisonValue;

      case "in": {
        if (!Array.isArray(comparisonValue)) {
          throw new Error(
            "Wrong condition format. The 'in' operator expects an array of values."
          );
        }

        return comparisonValue.includes(scalar);
      }

      case "and":
        return Object.entries(comparisonValue).every(
          ([operator, conditionValue]) =>
            this.#isScalarConditionFulfilled(scalar, {
              [operator]: conditionValue,
            })
        );

      case "or":
        return Object.entries(comparisonValue).some(
          ([operator, comparisonValue]) =>
            this.#isScalarConditionFulfilled(scalar, {
              [operator]: comparisonValue,
            })
        );

      default:
        throw new Error(
          `Wrong condition format. Unknown ${operator} operator.`
        );
    }
  }

  #isArrayConditionFulfilled(array, path, condition) {
    return array.some((item) =>
      this.#isConditionFulfilled(item, path, condition)
    );
  }

  #isConditionFulfilled(object, path, condition) {
    const [field, ...subPath] = path;
    const element = object[field];

    if (Array.isArray(element)) {
      return this.#isArrayConditionFulfilled(element, subPath, condition);
    }

    if (typeof element === "object" && element !== null) {
      return this.#isConditionFulfilled(element, subPath, condition);
    }

    // Here element is a primitive value
    // see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#primitive_values

    // Getting a scalar value while the path has not been fully explored
    if (subPath.length) {
      return false;
    }

    return this.#isScalarConditionFulfilled(element, condition);
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
