const {EligibilityService} = require('../src/eligibility.service');
const should = require('should');

describe('Eligibility', () => {

  describe('No condition', () => {
    it('should be eligible with no condition', () => {
      const cart = {};
      const criteria = {};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
  });

  describe('Basic condition', () => {
    it('should not be eligible when basic integer condition is not fulfilled (does not exist)', () => {
      const cart = {};
      const criteria = {total: 20};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should not be eligible when basic integer condition is not fulfilled (wrong value)', () => {
      const cart = {total: 30};
      const criteria = {total: 20};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should be eligible when basic integer condition is fulfilled', () => {
      const cart = {total: 20};
      const criteria = {total: 20};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
    it('should not be eligible when basic string condition is not fulfilled (does not exist)', () => {
      const cart = {};
      const criteria = {shopperId: 'shopper-id'};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should not be eligible when basic string condition is not fulfilled (wrong value)', () => {
      const cart = {shopperId: 'other-shopper-id'};
      const criteria = {shopperId: 'shopper-id'};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should be eligible when basic string condition is fulfilled', () => {
      const cart = {shopperId: 'shopper-id'};
      const criteria = {shopperId: 'shopper-id'};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
    it('should be eligible when basic integer condition is fulfilled with string value', () => {
      const cart = {total: "20"};
      const criteria = {total: 20};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
    it('should be eligible when basic string condition is fulfilled with integer value', () => {
      const cart = {total: 20};
      const criteria = {total: "20"};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
    it('should be eligible with random keys and value', () => {
      const key = (Math.random() + 1).toString(36).substring(7);
      const value = Math.floor(Math.random() * 100);
      const cart = {};
      const criteria = {};
      cart[key] = value;
      criteria[key] = value;

      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
    it('should not be eligible with random keys and different value', () => {
      const key = (Math.random() + 1).toString(36).substring(7);
      const value = Math.floor(Math.random() * 100);
      const cart = {};
      const criteria = {};
      cart[key] = value;
      criteria[key] = value + 1;

      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
  });

  describe('Gt condition', () => {
    it('should not be eligible when gt condition is not fulfilled', () => {
      const cart = {total: 10};
      const criteria = {total: {gt: 20}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should not be eligible when gt condition is not fulfilled (equal)', () => {
      const cart = {total: 20};
      const criteria = {total: {gt: 20}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should be eligible when gt condition is fulfilled', () => {
      const cart = {total: 30};
      const criteria = {total: {gt: 20}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
  });
  describe('Lt condition', () => {
    it('should not be eligible when lt condition is not fulfilled', () => {
      const cart = {total: 30};
      const criteria = {total: {lt: 20}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should not be eligible when lt condition is not fulfilled (equal)', () => {
      const cart = {total: 20};
      const criteria = {total: {lt: 20}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should be eligible when lt condition is fulfilled', () => {
      const cart = {total: 10};
      const criteria = {total: {lt: 20}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
  });

  describe('Gte condition', () => {
    it('should not be eligible when gte condition is not fulfilled', () => {
      const cart = {total: 10};
      const criteria = {total: {gte: 20}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should be eligible when gte condition is fulfilled (equal)', () => {
      const cart = {total: 20};
      const criteria = {total: {gte: 20}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
    it('should be eligible when gte condition is fulfilled', () => {
      const cart = {total: 30};
      const criteria = {total: {gte: 20}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
  });

  describe('Lte condition', () => {
    it('should not be eligible when lt condition is not fulfilled', () => {
      const cart = {total: 30};
      const criteria = {total: {lte: 20}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should be eligible when lt condition is fulfilled (equal)', () => {
      const cart = {total: 20};
      const criteria = {total: {lte: 20}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
    it('should be eligible when lt condition is fulfilled', () => {
      const cart = {total: 10};
      const criteria = {total: {lte: 20}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
  });

  describe('In condition', () => {
    it('should not be eligible when in condition is not fulfilled', () => {
      const cart = {shopperId: 'shopper-id0'};
      const criteria = {shopperId: {in: ['shopper-id1', 'shopper-id2']}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should be eligible when in condition is fulfilled', () => {
      const cart = {shopperId: 'shopper-id1'};
      const criteria = {shopperId: {in: ['shopper-id1', 'shopper-id2']}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
  });

  describe('And condition', () => {
    it('should not be eligible when and condition is not fulfilled (none)', () => {
      const cart = {total: 0};
      const criteria = {total: {and: {gt: 10, gt: 20}}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should not be eligible when and condition is not fulfilled (only one)', () => {
      const cart = {total: 30};
      const criteria = {total: {and: {gt: 10, lt: 20}}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should be eligible when and condition is fulfilled', () => {
      const cart = {total: 20};
      const criteria = {total: {and: {gt: 10, lt: 30}}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
  });

  describe('Or condition', () => {
    it('should not be eligible when or condition is not fulfilled', () => {
      const cart = {total: 0};
      const criteria = {total: {or: {gt: 10, gt: 20}}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should be eligible when or condition is fulfilled', () => {
      const cart = {total: 0};
      const criteria = {total: {or: {gt: 10, lt: 20}}};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
  });

  describe('Sub-object condition', () => {
    it('should not be eligible when sub object condition is not fulfilled (first level field does not exist)', () => {
      const cart = {};
      const criteria = {'products.quantity': 1};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should not be eligible when sub object condition is not fulfilled (second level field does not exist)', () => {
      const cart = {products:{}};
      const criteria = {'products.quantity': 1};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should not be eligible when sub object condition is not fulfilled (wrong value)', () => {
      const cart = {products:{quantity:2}};
      const criteria = {'products.quantity': 1};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should be eligible when sub object condition is fulfilled', () => {
      const cart = {products:{quantity:1}};
      const criteria = {'products.quantity': 1};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
    it('should not be eligible when array sub object condition is not fulfilled', () => {
      const cart = {products:[{quantity:2}]};
      const criteria = {'products.quantity': 1};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
    it('should be eligible when array sub object condition is fulfilled', () => {
      const cart = {products:[{quantity:1}]};
      const criteria = {'products.quantity': 1};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
    it('should be eligible when array sub object condition with two elements is fulfilled for first element', () => {
      const cart = {products:[{quantity:1}, {quantity: 2}]};
      const criteria = {'products.quantity': 1};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
    it('should be eligible when array sub object condition with two elements is fulfilled for second element', () => {
      const cart = {products:[{quantity:1}, {quantity: 2}]};
      const criteria = {'products.quantity': 2};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.true();
    });
    it('should be eligible when array sub object condition with two elements is not fulfilled', () => {
      const cart = {products:[{quantity:1}, {quantity: 2}]};
      const criteria = {'products.quantity': 3};
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
  });

  describe('Complex cases', () => {
    it('should be eligible with example values', () => {
      const cart = {
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
      const criteria = {
        "shopperId": "shopper-id",
        "totalAti": {
          "gt": 50
        },
        "products.productId": {
          "in": ["5449000054227"]
        },
        "date": {
          "and": {
            "gt": "2021-11-01T00:00:00.000Z",
            "lt": "2021-12-31T23:59:59.000Z"
          }
        }
      };
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
  });


  describe('Error Handling', () => {
    it('should throw an error when cart is null', () => {
      const eligibilityService = new EligibilityService();
      should(() => eligibilityService.isEligible(null, { total: { gt: 10 } }))
        .throw('Invalid cart or criteria');
    });

    it('should throw an error when criteria is null', () => {
      const eligibilityService = new EligibilityService();
      should(() => eligibilityService.isEligible({ total: 20 }, null))
        .throw('Invalid cart or criteria');
    });

    it('should throw an error when cart is not an object', () => {
      const eligibilityService = new EligibilityService();
      should(() => eligibilityService.isEligible(42, { total: { gt: 10 } }))
        .throw('Invalid cart or criteria');
    });

    it('should throw an error when criteria is not an object', () => {
      const eligibilityService = new EligibilityService();
      should(() => eligibilityService.isEligible({ total: 20 }, 42))
        .throw('Invalid cart or criteria');
    });

    it('should not throw an error for valid cart and criteria', () => {
      const eligibilityService = new EligibilityService();
      should(() => eligibilityService.isEligible({ total: 20 }, { total: { gt: 10 } })).not.throw();
    });
  });

  describe('Handling Missing Values Gracefully', () => {
    it('should return false when a non-existing key is checked', () => {
      const cart = {};
      const criteria = { nonExistentKey: { gt: 10 } };
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });

    it('should return false when a nested key does not exist', () => {
      const cart = { products: {} };
      const criteria = { 'products.price': { gt: 10 } };
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });

    it('should return false when accessing a deep nested key that is missing', () => {
      const cart = { user: { details: {} } };
      const criteria = { 'user.details.age': { gt: 18 } };
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });

    it('should return false when checking an array field that does not exist', () => {
      const cart = { products: [] };
      const criteria = { 'products.price': { gt: 10 } };
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });

    it('should return false when accessing an undefined field within an array', () => {
      const cart = { products: [{ name: 'item1' }] };
      const criteria = { 'products.price': { gt: 10 } };
      const eligibilityService = new EligibilityService();
      const actualEligibility = eligibilityService.isEligible(cart, criteria);
      should(actualEligibility).be.false();
    });
  });

});
