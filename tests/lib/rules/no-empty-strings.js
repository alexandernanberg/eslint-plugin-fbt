'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-empty-strings')

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
}

const ruleTester = new RuleTester({ parserOptions })
ruleTester.run('no-empty-strings', rule, {
  valid: [
    {
      code: `
         function Component() {
          const str = 'Hello';
          return (
            <div>
              <fbt desc="Greeting">Hello</fbt>
              <fbt desc="Greeting">{'Hello'}</fbt>
              <fbt desc="Greeting">{\`Hello\`}</fbt>
              {fbt('Hello world', 'Greeting')}
              {fbt(\`Hello world\`, 'Greeting')}
              {fbt(str, 'Greeting')}
            </div>
          );
         }
       `,
    },
  ],

  invalid: [
    {
      code: `
        function Component() {
          return (
            <div>
              <fbt desc="Greeting"></fbt>
              <fbt desc="Greeting">{''}</fbt>
              <fbt desc="Greeting">{\`\`}</fbt>
              {fbt('', 'Greeting')}
              {fbt(\`\`, 'Greeting')}
            </div>
          );
        }
       `,
      errors: [
        {
          messageId: 'jsxEmptyString',
        },
        {
          messageId: 'jsxEmptyString',
        },
        {
          messageId: 'jsxEmptyString',
        },
        {
          messageId: 'emptyString',
        },
        {
          messageId: 'emptyString',
        },
      ],
    },
  ],
})
