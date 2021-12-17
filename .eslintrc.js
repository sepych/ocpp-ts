module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript'
  ],
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    'class-methods-use-this': 0,
  }
};
