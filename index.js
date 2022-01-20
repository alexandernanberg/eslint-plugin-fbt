'use strict'

const rules = {
  'no-unwrapped-strings': require('./lib/rules/no-unwrapped-strings'),
  'no-empty-strings': require('./lib/rules/no-empty-strings'),
}

module.exports = {
  rules,
}
