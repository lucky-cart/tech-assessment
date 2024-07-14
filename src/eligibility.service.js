class EligibilityService {
  mathOpeMap = {
    gt: ">",
    gte: ">=",
    lt: "<",
    lte: "<=",
  };

  /**
   * Compare cart data with criteria to compute eligibility.
   * If all criteria are fulfilled then the cart is eligible (return true).
   *
   * @param cart
   * @param criteria
   * @return {boolean}
   */
  isEligible(cart, criteria) {
    return Object.entries(criteria).every(([key, unitCriteria]) => {
      const [parent, prop] = key.split(".");
      // Consider falsy-wrong (i.e: 0 (number))
      if (!["undefined", "null"].includes(typeof cart[key])) {
        return this.assert(cart[key], unitCriteria);
      } else if (parent && prop) {
        if (cart[parent]) {
          const data = Array.isArray(cart[parent])
            ? cart[parent]
            : [cart[parent]];

          return this.assertNested(data, { key, condition: unitCriteria });
        }
      }
    });
  }

  assert(data, criteria) {
    if (typeof data === "string" && typeof criteria === "string") {
      return data === criteria;
    } else if (typeof data === "number" && typeof criteria === "number") {
      return parseFloat(data) === parseFloat(criteria);
    }
    // Consider cases when type is mixed (ie. total)
    else if (["number", "string"].includes(typeof criteria)) {
      return parseFloat(data) === parseFloat(criteria);
    } else if (!Array.isArray(criteria) && typeof criteria === "object") {
      return this.assertConditional(data, criteria);
    }
    return false;
  }

  assertNested(products, criteria) {
    const [parent, prop] = criteria.key.split(".");
    const iterationFn =
      products.length > 1 ? Array.prototype.some : Array.prototype.every;

    if (typeof criteria.condition === "string") {
      return iterationFn.call(
        products,
        (product) => product[prop] && product[prop] === criteria.condition
      );
    } else if (typeof criteria.condition === "number") {
      return iterationFn.call(
        products,
        (product) =>
          product[prop] &&
          parseFloat(product[prop]) === parseFloat(criteria.condition)
      );
    } else if (!Array.isArray(criteria) && typeof criteria === "object") {
      return iterationFn.call(products, (product) =>
        this.assertConditional(product[prop], criteria.condition)
      );
    }
  }
  // ################################ //

  assertMathOpe(ope, left, right) {
    // eval is safe in our context, ONLY BECAUSE we master input
    return eval(`"${left}" ${this.mathOpeMap[ope]} "${right}"`);
  }

  assertConditional(value, criteria) {
    for (const [k, v] of Object.entries(criteria)) {
      if (k === "in" && Array.isArray(v)) {
        return v.includes(value);
      } else if (Object.keys(this.mathOpeMap).includes(k)) {
        return this.assertMathOpe(k, value, v);
      } else if (["and", "or"].includes(k) && !Array.isArray(v)) {
        const mapFn =
          k === "and" ? Array.prototype.every : Array.prototype.some;
        return mapFn.call(Object.keys(v), (_k) =>
          this.assertConditional(value, { [_k]: v[_k] })
        );
      }
    }
    return false;
  }
}

module.exports = {
  EligibilityService,
};
