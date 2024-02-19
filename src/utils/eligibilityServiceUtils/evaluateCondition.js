const {conditionHandlers} = require("../criteria/conditionHandlers");
const evaluateCondition = (value, condition) => {
    const operator = Object.keys(condition)[0];
    const operand = condition[operator];

    const handler = conditionHandlers[operator];
    if (!handler) return false; // Invalid condition type
    return handler(value, operand);
}

module.exports = {
    evaluateCondition,
}