'use strict'

const messages = {
  missingFbtContainer: 'Missing <fbt> element around JSX text: "{{text}}"',
}

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    messages,
  },
  create(context) {
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
        !/^[\s]+$/.test(node.value) &&
        !/^&[\w]+;$$/.test(node.raw.trim())
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
