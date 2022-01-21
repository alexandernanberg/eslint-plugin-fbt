# Enforce strings to be wrapped with `<fbt>` (fbt/no-unwrapped-strings)

## Rule Details

By default this rule requires that you wrap all literal strings in a `<fbt>` container.

Examples of **incorrect** code for this rule:

```jsx
<h1>Hello</h1>
```

```jsx
<h1>{`Hello`}</h1>
```

```jsx
<span title="Hello" />
```

Examples of **correct** code for this rule:

```jsx
<h1>
  <fbt desc="Greeting">Hello</fbt>
</h1>
```

```jsx
<h1>{fbt('Hello', 'Greeting')}</h1>
```

```jsx
<span title={fbt('Hello', 'Greeting')} />
```

## Rule Options

```js
...
"fbt/no-unwrapped-strings": [<enabled>, {"ignoredWords": Array<string>}]
...
```

### `ignoredWords`

A list of words that are not required to be translated. Like so:

```jsx
"fbt/no-unwrapped-strings": ["warn", { "ignoredWords": ["GitHub"] }]
```

## When Not To Use It

If you do not want to enforce all strings to be marked for translation, then you can disable this rule.
