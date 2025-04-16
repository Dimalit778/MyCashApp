module.exports = {
  extends: ["react-app", "plugin:cypress/recommended"],
  rules: {
    "no-unused-vars": "warn",
    "no-undef": "warn",
  },
  overrides: [
    {
      files: ["cypress/**/*.js"],
      env: {
        "cypress/globals": true,
      },
    },
  ],
};
