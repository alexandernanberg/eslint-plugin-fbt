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
      if (expression.type === 'Literal' && isEmptyString(expression.value)) {
        context.report({ messageId, node })
      } else if (
        expression.type === 'TemplateLiteral' &&
        expression.expressions.length === 0 &&
        isEmptyString(expression.quasis[0].value.raw)
      ) {
        context.report({ messageId, node })
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

        /*
          TODO: fix this naive check. Currently it's only checking for
          <fbt>{``}</fbt>
          but not when there are line breaks (children becomes JSXText)
          <fbt>
            {``}
          </fbt>
        */
        if (node.children[0].type === 'JSXExpressionContainer') {
          checkExpression(node, node.children[0].expression, 'jsxEmptyString')
        }
      },
      CallExpression(node) {
        if (node.callee.name !== 'fbt') {
          return
        }

        const argument = node.arguments[0]

        if (argument) {
          checkExpression(node, argument, 'emptyString')
        }
      },
    }
  },
}
