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
        for (const [key, condition] of Object.entries(criteria)) {
            // Retrieve the value from the cart for the given key
            const value = this.getNestedValue(cart, key)

            // If the value is undefined or doesn't meet the condition, return false
            if (
                value === undefined ||
                !this.evaluateCondition(value, condition)
            ) {
                return false
            }
        }

        // All criteria are satisfied
        return true
    }

    // Retrieves a nested value from an object using a dot-separated path.
    // Handles arrays by extracting values for each item.

    //  @param {Object} object
    //  @param {string} path
    //  @return {*}

    getNestedValue(object, path) {
        return path.split('.').reduce((obj, key) => {
            if (Array.isArray(obj)) {
                // If the current level is an array, extract values for the key from each item
                return obj.flatMap((item) => item[key] || [])
            }

            // Return the value for the current key or undefined if not found
            return obj ? obj[key] : undefined
        }, object)
    }

    //  Evaluates a condition against a value.
    //  Supports comparisons (gt, gte, lt, lte), inclusion (in), and logical operators (and, or).

    //  @param {*} value
    //  @param {Object|*} condition
    //  @return {boolean}

    evaluateCondition(value, condition) {
        if (Array.isArray(value)) {
            // Check if at least one item in the array satisfies the condition
            return value.some((item) => this.evaluateCondition(item, condition))
        }

        if (typeof condition === 'object') {
            // Handle greater than
            if (condition.gt !== undefined && value <= condition.gt)
                return false
            // Handle greater than or equal
            if (condition.gte !== undefined && value < condition.gte)
                return false
            // Handle less than
            if (condition.lt !== undefined && value >= condition.lt)
                return false
            // Handle less than or equal
            if (condition.lte !== undefined && value > condition.lte)
                return false
            // Handle inclusion
            if (condition.in && !condition.in.includes(value)) return false

            // Handle 'and' logical operator: all subconditions must be satisfied
            if (condition.and) {
                return Object.entries(condition.and).every(
                    ([key, subCondition]) =>
                        this.evaluateCondition(value, { [key]: subCondition })
                )
            }

            // Handle 'or' logical operator: at least one subcondition must be satisfied
            if (condition.or) {
                return Object.entries(condition.or).some(
                    ([key, subCondition]) =>
                        this.evaluateCondition(value, { [key]: subCondition })
                )
            }
        } else {
            // Handle simple comparison by converting both to strings
            return String(value) === String(condition)
        }

        // Default to true if no condition is specified
        return true
    }
}

module.exports = {
    EligibilityService,
}
