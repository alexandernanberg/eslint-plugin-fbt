'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/no-unwrapped-strings')

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
}

const ruleTester = new RuleTester({ parserOptions })
ruleTester.run('no-unwrapped-strings', rule, {
  valid: [
    {
      code: `
         function Component() {
          const foo = 'foo';

          return (
            <div>
              <fbt desc="Greeting">Hello</fbt>
              <fbt desc="Content">
                <a href="#" target="_blank">
                  Link
                </a>
              </fbt>
              <fbt desc="Counter">
                Count:
                <fbt:plural count={1} showCount="yes" many="items">
                  item
                </fbt:plural>
              </fbt>
              <fbt desc="Message">
                Your name is <fbt:param name="name">Alex</fbt:param>
              </fbt>
              <p>{foo} &middot;</p>
            </div>
          );
         }
       `,
    },
    {
      code: `
         function Component() {
          return (
            <div>
              <p>GitHub </p>
            </div>
          );
         }
       `,
      options: [
        {
          ignoredWords: ['GitHub'],
        },
      ],
    },
    {
      code: `
         function Component() {
          return (
            <div aria-label={fbt('Hello', 'Greeting')}></div>
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
            <div>Hello</div>
          );
        }
       `,
      errors: [
        {
          messageId: 'unwrappedString',
        },
      ],
    },
    {
      code: `
        function Component() {
          return (
            <div>
              <div aria-label="Hello" />
              <div aria-label={\`Hello\`} />
            </div>
          );
        }
       `,
      errors: [
        {
          messageId: 'unwrappedString',
        },
        {
          messageId: 'unwrappedString',
        },
      ],
    },
  ],
})
