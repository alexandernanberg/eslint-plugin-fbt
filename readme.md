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
    "fbt/missing-translation": "warn"
  }
}
```

# List of supported rules

| Rule                                                         | Description                                                    |
| :----------------------------------------------------------- | :------------------------------------------------------------- |
| [fbt/missing-translation](docs/rules/missing-translation.md) | Enforce string literals to be wrapped with a `<fbt>` container |

## License

[MIT](/license)
