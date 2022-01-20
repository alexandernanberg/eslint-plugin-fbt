# `eslint-plugin-fbt`

## Installation

```
$ npm install eslint-plugin-fbt --save-dev
```

## Configuration

Add "fbt" to the plugins section.

```json
{
  "plugins": ["fbt"]
}
```

Enable the rules that you would like to use.

```json
{
  "rules": {
    "fbt/no-empty-strings": "error",
    "fbt/no-unwrapped-strings": "warn"
  }
}
```

# List of supported rules

| Rule                                                           | Description                                                  |
| :------------------------------------------------------------- | :----------------------------------------------------------- |
| [fbt/no-unwrapped-strings](docs/rules/no-unwrapped-strings.md) | Enforce strings to be wrapped with `<fbt>` or `fbt()`        |
| [fbt/no-empty-strings](docs/rules/no-empty-strings.md)         | Prevent empty strings from being given to `<fbt>` or `fbt()` |

## License

[MIT](/license)
