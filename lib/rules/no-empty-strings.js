'use strict'

const { docsUrl } = require('../helpers')

function isEmptyString(str) {
  return typeof str === 'string' && str.trim().length === 0
}

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
    function checkExpression(node, expression, messageId) {
      switch (expression.type) {
        case 'Literal':
          if (isEmptyString(expression.value)) {
            context.report({ messageId, node })
          }
          break
        case 'TemplateLiteral':
          if (
            expression.expressions.length === 0 &&
            isEmptyString(expression.quasis[0].value.raw)
          ) {
            context.report({ messageId, node })
          }
          break
      }
    }

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
          if (child.type === 'JSXExpressionContainer') {
            checkExpression(node, child.expression, 'jsxEmptyString')
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

        checkExpression(node, node.arguments[0], 'emptyString')
      },
    }
  },
}
