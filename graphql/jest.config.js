/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/*.test.js"],
  collectCoverageFrom: ["schema/**/*.js", "!**/*.test.js"],
};
