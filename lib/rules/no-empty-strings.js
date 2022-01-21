'use strict'

const elementType = require('jsx-ast-utils/elementType')
const { extractLiteral } = require('jsx-ast-utils/lib/values/expressions')
const getLiteralPropValue = require('jsx-ast-utils/getLiteralPropValue')
const propName = require('jsx-ast-utils/propName')
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
        if (elementType(node.openingElement) !== 'fbt') {
          return
        }

        if (node.children.length === 0) {
          context.report({ messageId: 'jsxEmptyString', node })
          return
        }
      },
      JSXAttribute(node) {
        if (elementType(node.parent) !== 'fbt') {
          return
        }

        if (propName(node) !== 'desc') {
          return
        }

        const value = getLiteralPropValue(node)

        if (isEmptyString(value)) {
          context.report({ messageId: 'jsxEmptyString', node })
        }
      },
      TemplateLiteral(node) {
        if (
          node.parent.type === 'JSXExpressionContainer' &&
          node.parent.parent.type === 'JSXElement'
        ) {
          const value = extractLiteral(node)

          if (isEmptyString(value)) {
            context.report({ messageId: 'jsxEmptyString', node })
          }
        }
      },
      CallExpression(node) {
        if (node.callee.name !== 'fbt') {
          return
        }

        const text = node.arguments[0]
        const desc = node.arguments[1]

        if (text) {
          checkExpression(node, text, 'emptyString')
        }
        if (desc) {
          checkExpression(node, desc, 'emptyString')
        }
      },
    }
  },
}
