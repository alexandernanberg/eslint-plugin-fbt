'use strict'

function trimIfString(val) {
  return typeof val === 'string' ? val.trim() : val
}

function docsUrl(ruleName) {
  return `https://github.com/alexandernanberg/eslint-plugin-fbt/tree/master/docs/rules/${ruleName}.md`
}

const messages = {
  missingFbtContainer: 'Missing <fbt> element around JSX text: "{{text}}"',
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce string literals to be wrapped with a `<fbt>` container',
      url: docsUrl('missing-translation'),
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

    function reportLiteralNode(node) {
      context.report({
        messageId: 'missingFbtContainer',
        node,
        data: {
          text: context.getSourceCode().getText(node).trim(),
        },
      })
    }

    function getParentIgnoringBinaryExpressions(node) {
      let current = node
      while (current.parent.type === 'BinaryExpression') {
        current = current.parent
      }
      return current.parent
    }

    function isFbt(node) {
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

    function getValidation(node) {
      const parent = getParentIgnoringBinaryExpressions(node)

      if (
        parent.type.includes('JSX') &&
        typeof node.value === 'string' &&
        // Ignore whitespace
        !/^[\s]+$/.test(node.value) &&
        // Ignore HTML entities
        !/^&[\w]+;$$/.test(node.raw.trim()) &&
        // Ignore ignored words
        !config.ignoredWords.has(node.value.trim())
      ) {
        const isParentFbt = isFbt(parent)
        const isGrandparentFbt = isFbt(
          getParentIgnoringBinaryExpressions(parent)
        )
        return !(isParentFbt || isGrandparentFbt)
      }

      return false
    }

    /** @type {import('eslint').Rule.RuleListener} */
    return {
      JSXText(node) {
        if (getValidation(node)) {
          reportLiteralNode(node)
        }
      },
    }
  },
}
