# Prevent empty strings from being given to `<fbt>` or `fbt()` (fbt/no-empty-strings)

## Rule Details

This rule prevents empty strings from being given to `<fbt>` or `fbt()`.

Examples of **incorrect** code for this rule:

```jsx
var Hello = <fbt desc="Greeting">{''}</fbt>
var Hello = fbt('', 'Greeting')
```

Examples of **correct** code for this rule:

```jsx
var Hello = <fbt desc="Greeting">Hello</fbt>
var Hello = fbt('Hello', 'Greeting')
```
