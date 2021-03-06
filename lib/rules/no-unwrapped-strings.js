'use strict'

const { extractLiteral } = require('jsx-ast-utils/lib/values/expressions')
const getLiteralPropValue = require('jsx-ast-utils/getLiteralPropValue')
const elementType = require('jsx-ast-utils/elementType')
const propName = require('jsx-ast-utils/propName')
const { docsUrl } = require('../helpers')

function trimIfString(val) {
  return typeof val === 'string' ? val.trim() : val
}

const attributes = new Set([
  'title',
  'placeholder',
  'alt',
  'label',
  'aria-label',
  'aria-errormessage',
])

const messages = {
  unwrappedString: 'String must be wrapped in `<fbt>` or `fbt()`',
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enforce strings to be wrapped with `<fbt>` or `fbt()`',
      url: docsUrl('no-unwrapped-strings'),
    },
    messages,
    schema: [
      {
        type: 'object',
        properties: {
          ignoredWords: {
            type: 'array',
            uniqueItems: true,
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const defaults = {
      ignoredWords: [],
    }
    const config = Object.assign({}, defaults, context.options[0] || {})
    config.ignoredWords = new Set(config.ignoredWords.map(trimIfString))

    function getParentIgnoringBinaryExpressions(node) {
      let current = node
      while (current.parent.type === 'BinaryExpression') {
        current = current.parent
      }
      return current.parent
    }

    function isNodeFbt(node) {
      if (node.type === 'JSXElement') {
        const name = elementType(node.openingElement)
        return name === 'fbt' || name.startsWith('fbt:')
      }

      return false
    }

    function checkText(node) {
      const parent = getParentIgnoringBinaryExpressions(node)

      if (
        !isNodeFbt(parent) &&
        !isNodeFbt(getParentIgnoringBinaryExpressions(parent))
      ) {
        context.report({
          messageId: 'unwrappedString',
          node,
        })
      }
    }

    function isIgnoredWord(value) {
      return typeof value === 'string' && config.ignoredWords.has(value.trim())
    }

    /** @type {import('eslint').Rule.RuleListener} */
    return {
      JSXText(node) {
        // Ignore whitespace
        if (/^[\s]+$/.test(node.value)) {
          return
        }
        // Ignore HTML entities
        if (/^&[\w]+;$/.test(node.raw.trim())) {
          return
        }
        // Ignore words that aren't configured to be checked
        if (isIgnoredWord(node.value)) {
          return
        }

        checkText(node)
      },
      JSXAttribute(node) {
        const name = propName(node)

        // Ignore attributes not present in list
        if (!attributes.has(name)) {
          return
        }

        const value = getLiteralPropValue(node)

        if (!value) {
          return
        }

        // Ignore words that aren't configured to be checked
        if (isIgnoredWord(value)) {
          return
        }

        context.report({ messageId: 'unwrappedString', node })
      },
      TemplateLiteral(node) {
        if (
          node.parent.type === 'JSXExpressionContainer' &&
          node.parent.parent.type === 'JSXElement'
        ) {
          const value = extractLiteral(node)

          // Ignore words that aren't configured to be checked
          if (isIgnoredWord(value)) {
            return
          }

          checkText(node.parent)
        }
      },
    }
  },
}
