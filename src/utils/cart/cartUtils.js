const cartHasKey = (cart, key) => {
    const keys = key.split('.');
    let value = cart;
    for (const k of keys) {
        if (!(k in value)) return false;
        value = value[k];
    }
    return true;
}

const getValueFromKey = (cart, key) => {
    const keys = key.split('.');
    let value = cart;
    for (const k of keys) {
        value = value[k];
    }
    return value;
};

module.exports = {
    cartHasKey,
    getValueFromKey,
};