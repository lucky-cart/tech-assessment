const IS_DEBUG = true;

const mathOpeMap = {
  gt: ">",
  gte: ">=",
  lt: "<",
  lte: "<=",
};

function assertMathOpe(ope, left, right) {
  left = typeof left === "string" ? `"${left}"` : left;
  right = typeof right === "string" ? `"${right}"` : right;
  return eval(`${left} ${mathOpeMap[ope]} ${right}`);
}

function assertConditional(value, criteria) {
  for (const [k, v] of Object.entries(criteria)) {
    if (k === "in" && Array.isArray(v)) {
      return v.includes(value);
    } else if (Object.keys(mathOpeMap).includes(k)) {
      return assertMathOpe(k, value, v);
    } else if (k === "and" && !Array.isArray(v)) {
      return Object.keys(v).every((_k) =>
        assertConditional(value, { [_k]: v[_k] })
      );
    } else if (k === "or" && !Array.isArray(v)) {
      return Object.keys(v).some((_k) =>
        assertConditional(value, { [_k]: v[_k] })
      );
    }
  }
  return false;
}

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

    const assertFnMap = {
      shopperId: this.isEligibleGeneric,
      date: this.isEligibleGeneric,
      total: this.isEligibleGeneric,
      totalAti: this.isEligibleGeneric,
    };

    // Checking format of cart, criteria
    // Has the cart

    // Extract the criteria

    const debugResults = [];
    const results = [];
    for (const [key, unitCriteria] of Object.entries(criteria)) {
      const assertFn = assertFnMap[key] || this.isEligibleGeneric;
      let isEligible = false;

      // Take into account cases wrong false
      if (!["undefined", "null"].includes(typeof cart[key]) && assertFn) {
        const isEligible = assertFn(cart[key], unitCriteria);

        if (IS_DEBUG) debugResults.push({ [key]: isEligible });
        results.push(isEligible);
        continue;
      }
      // We specifically target `products.` as trying to make the case generic is irrelevant in this assessment context
      else if (
        key.startsWith("products.") &&
        cart.products &&
        (Array.isArray(cart.products) || Object.keys(cart.products).length)
      ) {
        const products = Array.isArray(cart.products)
          ? cart.products
          : [cart.products];

        isEligible = this.isProductEligible(products, {
          key,
          condition: unitCriteria,
        });

        if (IS_DEBUG) debugResults.push({ [key]: isEligible });
        results.push(isEligible);
        continue;
      }
      if (IS_DEBUG) debugResults.push({ [key]: isEligible });
      results.push(isEligible);
    }

    /*
    console.log(
      debugResults,
      results,
      results.every((t) => t)
    );
    //*/

    return results.every((t) => t);
  }

  /*
  // Done // @todo remove this
  isShopperEligible(shopperId, criteria) {
    if (typeof criteria === "string") {
      return shopperId === criteria;
    } else if (!Array.isArray(criteria) && typeof criteria === "object") {
      return assertConditional(shopperId, criteria);
    }
    return false;
  }

  // Done
  isDateEligible(date, criteria) {
    if (typeof criteria === "string") {
      return date === criteria;
    } else if (!Array.isArray(criteria) && typeof criteria === "object") {
      return assertConditional(date, criteria);
    }
    return false;
  }
  

  // Done
  isTotalEligible(total, criteria) {
    // @todo send to assertConditional();
    if (["number", "string"].includes(typeof criteria)) {
      return parseFloat(total) === parseFloat(criteria);
    } else if (!Array.isArray(criteria) && typeof criteria === "object") {
      return assertConditional(total, criteria);
    }
    return false;
  }
//*/

  // Done
  isProductEligible(products, criteria) {
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
        assertConditional(product[prop], criteria.condition)
      );
    }
    return false;
  }

  isEligibleGeneric(data, criteria) {
    if (typeof data === "string" && typeof criteria === "string") {
      return data === criteria;
    } else if (typeof data === "number" && typeof criteria === "number") {
      return parseFloat(data) === parseFloat(criteria);
    } else if (["number", "string"].includes(typeof criteria)) {
      return parseFloat(data) === parseFloat(criteria);
    } else if (!Array.isArray(criteria) && typeof criteria === "object") {
      return assertConditional(data, criteria);
    }
    return false;
  }
}

module.exports = {
  EligibilityService,
};
