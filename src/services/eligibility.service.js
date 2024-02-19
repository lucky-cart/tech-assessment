const {cartHasKey, getValueFromKey} = require("../utils/cart/cartUtils");
const {evaluateCondition} = require("../utils/eligibilityServiceUtils/evaluateCondition");

class EligibilityService {

  isEligible(cart, criteria) {
    for (const key in criteria) {
      if (!criteria.hasOwnProperty(key)) continue;
      if (!cartHasKey(cart, key)) return false;

      const condition = criteria[key];
      const cartValue = getValueFromKey(cart, key);

      if (!evaluateCondition(cartValue, condition)) return false;
    }
    return true;
  };
}

module.exports = {
  EligibilityService,
};
