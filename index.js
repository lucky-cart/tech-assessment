const { EligibilityService } = require("./src/eligibility.service");

const cartFile = process.argv[2];
const criteriaFile = process.argv[3];

if (!cartFile || !criteriaFile) {
  console.error("Missing cart file.");
  console.error("Usage: node index.js [CART_FILE] [PROFILE_FILE]");
  process.exit(1);
}

let cart;
let criteria;
try {
  cart = require(cartFile);
} catch (err) {
  console.error("Invalid cart file.");
  console.error("Usage: node index.js [CART_FILE] [PROFILE_FILE]");
  process.exit(2);
}

try {
  criteria = require(criteriaFile);
} catch (err) {
  console.error("Invalid criteria file.");
  console.error("Usage: node index.js [CART_FILE] [PROFILE_FILE]");
  process.exit(3);
}

const eligibilityService = new EligibilityService();
const isEligible = eligibilityService.isEligible(cart, criteria);
console.log(`Cart Eligibility: ${isEligible}`);
