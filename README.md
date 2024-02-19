# Lucky Cart – Technical Assessment

In this assessment, you have to calculate cart eligibility to a campaign. To do so, you have to compare criteria with cart data.

## How to do the assessment

1. Read this entire documentation
2. Clone this repository
3. Open [src/eligibility.service.js](src/services/eligibility.service.js) file and edit `isEligible(cart, criteria)` method.
4. Run `npm start` or `node index.js ./cart-test.json ./criteria-test.json` to check results
5. You can edit [cart-test.json](./cart-test.json) or [criteria-test.json](./criteria-test.json) for more tests.

You are free to use internet (Google, StackOverflow, ...), to ask question or do whatever you want to pass this assessment.

💡 Advice: be lean. Develop one condition at a time.

## Carts

A cart represent an online transaction. It has many parameters such as `cartId`, `shopperId`, `products`, ...

Cart example:
```json
{
  "cartId": "cart-id",
  "shopperId": "shopper-id",
  "date": "2021-10-06T18:35:42.000Z",
  "totalAti": 99.80,
  "promoCode": "voucher-42",
  "products": [
    {
      "productId": "5449000054227",
      "quantity": 20,
      "unitPriceAti": 2.5,
      "totalPriceAti": 50
    },
    {
      "productId": "3099873045369",
      "quantity": 2,
      "unitPriceAti": 24.90,
      "totalPriceAti": 49.80
    }
  ]
}
```

## Criteria

Criteria are a list of key-conditions values (eg: `{key1: condition1, key2: condition2}`). If all the conditions are fulfilled then the cart is eligible.

To validate a condition, you have to compare the condition with the value of the same key in the cart. 
If there is some "." in the key, compare to the value of the sub-object (eg: `{ "products.productId": condition }` in criteria means to check `{ products: { productId: value } }` or `{ products: [{ productId: value }] }` in cart). 

Available condition types:
- Basic condition (eg: `total: 20`) matches when `total == 20`;
- `gt`, `lt`, `gte`, `lte` matches respectively when cart value is greater, lower, greater or equal, lower or equal;
- `in` (followed by an array) matches when at least one of the cart values is in the following array;
- `and` (follower by at least two conditions) matches when every following conditions match;
- `or` (follower by at least two conditions) matches when at least one of the following conditions matches.

⚠️ Conditions are typeless! `{ total: 20 }` matches `{ total: "20" }` and `{ total: 20.0 }`.


Criteria example:
```json
{
  "shopperId": "shopper-id",
  "totalAti": {
    "gt": 50
  },
  "products.productId": {
    "in": ["5449000054227"]
  },
  "date": {
    "and": {
      "gt": "2021-01-01T00:00:00.000Z",
      "lt": "2021-12-31T23:59:59.000Z"
    }
  }
}
```

## Examples

Criteria:
```json
{
  "shopperId": "eligible-shopper-id",
  "totalAti": {
    "gt": 50
  }
}
```

Eligible cart:
```json
{
  "cartId": "eligible-cart-id",
  "shopperId": "eligible-shopper-id",
  "totalAti": 100
}
```

Not eligible cart:
```json
{
  "cartId": "not-eligible-cart-id",
  "shopperId": "not-eligible-shopper-id",
  "totalAti": 25
}
```
