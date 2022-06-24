/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  "root": true,
  "extends": [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "plugin:jsdoc/recommended"
  ],
  "rules": {
    "jsdoc/require-jsdoc": "off"
  },
  "env": {
    jest: true
  }
}
