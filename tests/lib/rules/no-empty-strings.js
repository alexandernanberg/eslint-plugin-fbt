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
          const str = '';
          return (
            <div>
              <p><fbt desc="Greeting">Hello</fbt></p>
              <p><fbt desc="Greeting">{'Hello'}</fbt></p>
              <p>{fbt('Hello world', 'Greeting')}</p>
              <p>{fbt(str, 'Greeting')}</p>
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
          const str = '';
          return (
            <div>
              <p><fbt desc="Greeting"></fbt></p>
              <p><fbt desc="Greeting">{''}</fbt></p>
              <p>{fbt('', 'Greeting')}</p>
              <p>{fbt(\`\`, 'Greeting')}</p>
              <p>{fbt(\`\${str}\`, 'Greeting')}</p>
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
          messageId: 'emptyString',
        },
        {
          messageId: 'emptyString',
        },
      ],
    },
  ],
})
