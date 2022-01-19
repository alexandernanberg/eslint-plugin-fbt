# Enforce string literals to be wrapped with a `<fbt>` container (fbt/missing-translation)

## Rule Details

By default this rule requires that you wrap all literal strings in a `<fbt>` container.

Examples of **incorrect** code for this rule:

```jsx
var Hello = <h1>Hello</h1>
```

Examples of **correct** code for this rule:

```jsx
var Hello = (
  <h1>
    <fbt desc="Greeting">Hello</fbt>
  </h1>
)
```

## Rule Options

```js
...
"fbt/missing-translation": [<enabled>, {
  "ignoredWords": Array<string>,
}]
...
```

### `ignoredWords`

A list of words that are not required to be translated. Like so:

```jsx
"fbt/missing-translation": ["warn", { "ignoredWords": ["GitHub"] }]
```

## When Not To Use It

If you do not want to enforce all strings to be translated, then you can disable this rule.
