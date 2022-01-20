'use strict'

const { docsUrl } = require('../helpers')

const messages = {
  jsxEmptyString: '<fbt> cannot be given an empty string',
  emptyString: 'fbt() cannot be given an empty string',
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Prevent empty strings from being given to `<fbt>` or `fbt()`',
      url: docsUrl('no-empty-strings'),
    },
    messages,
    schema: [],
  },

  create(context) {
    /** @type {import('eslint').Rule.RuleListener} */
    return {
      JSXElement(node) {
        if (node.openingElement.name.name !== 'fbt') {
          return
        }

        if (node.children.length === 0) {
          context.report({ messageId: 'jsxEmptyString', node })
          return
        }

        for (const child of node.children) {
          if (
            child.type === 'JSXExpressionContainer' &&
            child.expression.value.trim().length === 0
          ) {
            context.report({ messageId: 'jsxEmptyString', node })
          }
        }
      },
      CallExpression(node) {
        if (node.callee.name !== 'fbt') {
          return
        }

        if (node.arguments.length === 0) {
          return
        }

        const [arg] = node.arguments

        switch (arg.type) {
          case 'Literal': {
            if (
              typeof arg.value === 'string' &&
              arg.value.trim().length === 0
            ) {
              context.report({ messageId: 'emptyString', node })
            }
            break
          }
          case 'TemplateLiteral':
            if (arg.expressions.length === 0) {
              context.report({ messageId: 'emptyString', node })
            }
            break
        }
      },
    }
  },
}
