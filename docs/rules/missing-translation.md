# Enforce string literals to be wrapped with a `<fbt>` container (fbt/missing-translations)

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

## When Not To Use It

If you do not want to enforce all strings to be translated, then you can disable this rule.
