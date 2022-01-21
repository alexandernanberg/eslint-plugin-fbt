# Prevent empty strings from being given to `<fbt>` or `fbt()` (fbt/no-empty-strings)

## Rule Details

This rule prevents empty strings from being given to `<fbt>` or `fbt()`.

Examples of **incorrect** code for this rule:

```jsx
<fbt desc="Greeting"></fbt>
```

```jsx
<fbt desc="Greeting">{''}</fbt>
```

```jsx
<fbt desc="">Hello</fbt>
```

```jsx
fbt('', 'Greeting')
```

```jsx
fbt('Hello', '')
```

Examples of **correct** code for this rule:

```jsx
<fbt desc="Greeting">Hello</fbt>
```

```jsx
fbt('Hello', 'Greeting')
```
