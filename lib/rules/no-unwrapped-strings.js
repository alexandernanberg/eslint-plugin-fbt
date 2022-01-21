'use strict'

const getLiteralPropValue = require('jsx-ast-utils/getLiteralPropValue')
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
        const type = node.openingElement.name.type

        switch (type) {
          case 'JSXIdentifier':
            return node.openingElement.name.name === 'fbt'
          case 'JSXNamespacedName':
            return node.openingElement.name.namespace.name === 'fbt'
          default:
            return true
        }
      }

      return false
    }

    function checkText(node) {
      const parent = getParentIgnoringBinaryExpressions(node)

      if (
        parent.type.includes('JSX') &&
        !(
          isNodeFbt(parent) ||
          isNodeFbt(getParentIgnoringBinaryExpressions(parent))
        )
      ) {
        context.report({
          messageId: 'unwrappedString',
          node,
        })
      }
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
        if (config.ignoredWords.has(node.value.trim())) {
          return
        }

        checkText(node)
      },
      JSXAttribute(node) {
        // Ignore attributes that aren't configured to be checked
        if (!attributes.has(node.name.name)) {
          return
        }

        const attributeValue = getLiteralPropValue(node)

        // Ignore words that aren't configured to be checked
        if (
          typeof attributeValue === 'string' &&
          config.ignoredWords.has(attributeValue.trim())
        ) {
          return
        }

        if (attributeValue) {
          context.report({ messageId: 'unwrappedString', node })
        }
      },
    }
  },
}
