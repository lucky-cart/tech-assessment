const fs = require("fs");
const path = require("path");
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
  /**
   * Don't know if it was intentional or not but I refactored to properly import the files
   * We can not use `require()` DIRECTLY as Node will interpret it as a `module` while JSON is not
   * Approach 1: Using `require(path.resolve(criteriaFile));` works but ...
   * ... comes with issues security, performance, etc...
   */
  // cart = require(cartFile);
  cart = JSON.parse(fs.readFileSync(path.resolve(cartFile), "utf8"));
} catch (err) {
  console.error("Invalid cart file.");
  console.error("Usage: node index.js [CART_FILE] [PROFILE_FILE]");
  process.exit(2);
}

try {
  // criteria = require(criteriaFile);
  criteria = JSON.parse(fs.readFileSync(path.resolve(criteriaFile), "utf8"));
} catch (err) {
  console.error("Invalid criteria file.");
  console.error("Usage: node index.js [CART_FILE] [PROFILE_FILE]");
  process.exit(3);
}

const eligibilityService = new EligibilityService();
const isEligible = eligibilityService.isEligible(cart, criteria);
console.log(`Cart Eligibility: ${isEligible}`);
