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
    const results = [];
    for (const [key, unitCriteria] of Object.entries(criteria)) {
      let isEligible = false;

      // Consider falsy-wrong (i.e: 0 (number))
      if (!["undefined", "null"].includes(typeof cart[key])) {
        const isEligible = this.assert(cart[key], unitCriteria);
        results.push(isEligible);
        continue;
      }
      // We specifically target `products.` as trying to make the case generic is irrelevant in this assessment context
      // Product seems to be the only data with sub-data
      else if (
        key.startsWith("products.") &&
        cart.products &&
        (Array.isArray(cart.products) || Object.keys(cart.products).length)
      ) {
        // Simplify the process by normalizing the data and treat all cases
        const products = Array.isArray(cart.products)
          ? cart.products
          : [cart.products];

        isEligible = this.assertProduct(products, {
          key,
          condition: unitCriteria,
        });

        results.push(isEligible);
        continue;
      }
      results.push(isEligible);
    }

    return results.every((t) => t);
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

  assertProduct(products, criteria) {
    const prop = criteria.key.split(".").pop();
    const { some, every } = Array.prototype;
    const iterationFn = products.length === 1 ? every : some;

    if (typeof criteria.condition === "string") {
      return iterationFn.call(products, (product) => {
        return product[prop] && product[prop] === criteria.condition;
      });
    } else if (typeof criteria.condition === "number") {
      return iterationFn.call(products, (product) => {
        return (
          product[prop] &&
          parseFloat(product[prop]) === parseFloat(criteria.condition)
        );
      });
    } else if (!Array.isArray(criteria) && typeof criteria === "object") {
      return iterationFn.call(products, (product) =>
        this.assertConditional(product[prop], criteria.condition)
      );
    }
    return false;
  }

  // ################################ //

  assertMathOpe(ope, left, right) {
    left = typeof left === "string" ? `"${left}"` : left;
    right = typeof right === "string" ? `"${right}"` : right;
    // eval is safe in our context, ONLY BECAUSE we master input
    return eval(`${left} ${this.mathOpeMap[ope]} ${right}`);
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
