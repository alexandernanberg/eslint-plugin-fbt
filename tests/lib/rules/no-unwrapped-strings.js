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
         function Component(props) {
          const foo = 'foo';

          return (
            <div {...props}>
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
              <p className="foo">GitHub</p>
              <p>{\`GitHub\`}</p>
              <span title="GitHub" />
              <span title={\`GitHub\`} />
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
            <div>
              <div aria-label={fbt('Hello', 'Greeting')}></div>
              <div aria-label={fbt(\`Hello\`, 'Greeting')}></div>
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
              <div>Hello</div>
              <div>{\`Hello\`}</div>
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
    {
      code: `
        function Component() {
          const name = 'Foo';
          return (
            <div>
              <div aria-label="Hello" />
              <div aria-label={\`Hello\`} />
              <div aria-label={\`Hello \${name}\`} />
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
        {
          messageId: 'unwrappedString',
        },
      ],
    },
  ],
})
