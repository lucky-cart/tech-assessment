class EligibilityService {
  /**
   * Vérifie si le panier est éligible en fonction des critères.
   * @param {Object} cart - L'objet panier.
   * @param {Object} criteria - Les critères d'éligibilité.
   * @returns {boolean} - True si éligible, sinon false.
   */
  isEligible(cart, criteria) {
    if (!criteria || Object.keys(criteria).length === 0) {
      return true;
    }

    return Object.keys(criteria).every(key => {
      const condition = criteria[key];
      const cartValue = this.getCartValue(cart, key);

      if (Array.isArray(cartValue)) {
        return cartValue.some(value => this.matchCondition(value, condition));
      }

      return this.matchCondition(cartValue, condition);
    });
  }

  /**
   * Récupère la valeur d'une clé imbriquée dans le panier.
   * @param {Object} cart - L'objet panier.
   * @param {string} key - La clé imbriquée sous forme de chaîne.
   * @returns {*} - La valeur correspondant à la clé.
   */
  getCartValue(cart, key) {
    return key.split('.').reduce((obj, part) => {
      if (!obj) return undefined;

      if (Array.isArray(obj)) {
        return obj.flatMap(subObj => subObj[part] !== undefined ? subObj[part] : []);
      }

      return obj[part];
    }, cart);
  }

    /**
   * Vérifie si une valeur satisfait une condition.
   * @param {*} value - La valeur à tester.
   * @param {*} condition - La condition à vérifier.
   * @returns {boolean} - True si la condition est remplie, sinon false.
   */
    matchCondition(value, condition) {
      if (typeof condition === 'object' && condition !== null) {
        const operators = ['gt', 'lt', 'gte', 'lte', 'in', 'and', 'or'];
        for (const operator of operators) {
          if (condition[operator] !== undefined) {
            return this.evaluateCondition(value, operator, condition[operator]);
          }
        }
      }
      return value == condition;
    }

    /**
   * Évalue une condition en fonction de l'opérateur.
   * @param {*} value - La valeur à tester.
   * @param {string} operator - L'opérateur de la condition.
   * @param {*} conditionValue - La valeur de la condition.
   * @returns {boolean} - True si la condition est remplie, sinon false.
   */
  evaluateCondition(value, operator, conditionValue) {
    const operations = {
      'gt': (a, b) => Number(a) > Number(b),
      'lt': (a, b) => Number(a) < Number(b),
      'gte': (a, b) => Number(a) >= Number(b),
      'lte': (a, b) => Number(a) <= Number(b),
      'in': (a, b) => b.includes(a),
      'and': (_, b) => Object.keys(b).every(subKey => this.evaluateCondition(value, subKey, b[subKey])),
      'or': (_, b) => Object.keys(b).some(subKey => this.evaluateCondition(value, subKey, b[subKey]))
    };

    return operations[operator] ? operations[operator](value, conditionValue) : value == conditionValue;
  }

}

module.exports = { EligibilityService };
