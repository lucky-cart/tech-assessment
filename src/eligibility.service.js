
function eq(cartValue, criteriaValue) {
  if (Array.isArray(cartValue)) {
    return cartValue.some((cv) => cv == criteriaValue);
  }
  return cartValue == criteriaValue;
}

function gt(cartValue, criteriaValue) {
  return cartValue > criteriaValue;
}

function lt(cartValue, criteriaValue) {
  return cartValue < criteriaValue;
}

function gte(cartValue, criteriaValue) {
  return cartValue >= criteriaValue;
}

function lte(cartValue, criteriaValue) {
  return cartValue <= criteriaValue;
}

function inFunction(cartValue, criteriaValue) {
  if (Array.isArray(cartValue)) {
    return cartValue.some((cv) => criteriaValue.includes(cv));
  }
  return criteriaValue.includes(cartValue);
}

function andFunction(cartValue, values) {
  return Object.keys(values).every((key) => {
    const v = values[key];
    if (key in logicalConditions) {
      return logicalConditions[key](cartValue, v);
    } else {
      return eq(cartValue, v);
    }
  });
}

function orFunction(cartValue, values) {
  return Object.keys(values).some((key) => {
    const v = values[key];
    if (key in logicalConditions) {
      return logicalConditions[key](cartValue, v);
    } else {
      return eq(cartValue, v);
    }
  });
}

const logicalConditions = {
  gt: gt,
  lt: lt,
  gte: gte,
  lte: lte,
  and: andFunction,
  or: orFunction,
  in: inFunction,
};
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
    const criteriaKeys = Object.keys(criteria);
    const criteriaKeysLength = criteriaKeys.length;

    if (!criteriaKeysLength) {
      return true;
    }

    let count = 0;
    while (criteriaKeysLength > count) {
      const key = criteriaKeys[count];
      const criterion = criteria[key];
      const isMet = this.isCriterionMet(cart, key, criterion);
      if (!isMet) {
        return false;
      }
      count++;
    }
    return true;
  }

  /**
   * Format key to get the value or values from the cart.
   * Shall format the cart values into an array when needed to check multiple occurrences.
   *
   * @param path - key pathway to cart value
   * @param cart
   * @return { string | number | Array<string> | Array<number> }
   */
  getCartValue(path, cart, count = 0) {
    let finalValue = cart;

    const keys = path.trim('.').split(".").filter((e) => e);
    const keyArrayLength = keys.length;

    while (keyArrayLength > count) {
      const key = keys[count];
      if (Array.isArray(finalValue)) {

        finalValue = finalValue.map((e) => this.getCartValue(path, e, count));
        break;
      }
      else if (typeof finalValue === "object") {
        finalValue = this.getCartValue(path.replace(key, ''), cart[key], count);
      }
      if (finalValue === undefined) {
        break;
      }
      count++;
    }

    if (Array.isArray(finalValue)) {
      return finalValue.flat(1);
    }
    return finalValue;
  }

  /**
   * Check if cart value meets one criterion
   * The passed key needs to be the one in relation with the criterion.
   *
   * @param cart
   * @param key
   * @param criterion
   * @return { boolean }
   */
  isCriterionMet(cart, key, criterion) {
    const cartValue = this.getCartValue(key, cart);
    if (cartValue === undefined) {
      return false;
    }

    if (typeof criterion === "object") {
      return Object.keys(criterion).every((k) => {
        if (k in logicalConditions) {
          return logicalConditions[k](cartValue, criterion[k]);
        }
        return false;
      });
    }
    return eq(cartValue, criterion);
  }
}

module.exports = {
  EligibilityService,
};
