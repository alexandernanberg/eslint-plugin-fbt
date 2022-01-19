'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/missing-translation')

const parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
}

const ruleTester = new RuleTester({ parserOptions })
ruleTester.run('missing-translation', rule, {
  valid: [
    {
      code: `
         function Component() {
          const foo = 'foo';

          return (
            <div>
              <h1><fbt desc="Greeting">Hello</fbt></h1>
              <p>
                <fbt desc="Content">
                  <a href="#" target="_blank">
                    Link
                  </a>
                </fbt>
              </p>
              <p>
                <fbt desc="Counter">
                  Count:
                  <fbt:plural count={1} showCount="yes" many="items">
                    item
                  </fbt:plural>
                </fbt>
              </p>
              <p>
                <fbt desc="Message">
                  Your name is <fbt:param name="name">Alex</fbt:param>
                </fbt>
              </p>
              <p>{foo} &middot;</p>
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
  ],

  invalid: [
    {
      code: `
        function Component() {
          return (
            <div>
              <h1>Hello</h1>
            </div>
          );
        }
       `,
      errors: [
        {
          messageId: 'missingFbtContainer',
          data: { text: 'Hello' },
        },
      ],
    },
  ],
})
