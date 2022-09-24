![logo](https://github.com/connorjburton/senvf/blob/master/logo.jpg)

# senvf

A secure & sensible replacement for `process.env`.

## Why?

- Most JavaScript supply chain attacks target the `process.env` object.
- It's common to see `process.env` values being used without the correct data type checks

## How does this help?

- Ensures `process.env` is always empty, a supply chain attack that `POST`s your `process.env` content to a remote server no longer poses a risk.
- Provides `has`/`get` helper functions

## Installation

**yarn**

`yarn add senvf`

**npm**

`npm install senvf`

## Documentation

[View the documentation online here](https://connorjburton.github.io/senvf), or run `yarn docs` in the repository.

## Usage

Import `senvf` as early as possible in your codebase once `process.env` is fully set (i.e. after `import 'dotenv/config'`).

On the **first** import of `senvf` it will copy all values from `process.env` and set `process.env` to an empty object.

`process.env` is proxied to set any values to the internal `senvf` object instead. [See this test](https://github.com/connorjburton/senvf/blob/master/index.test.ts#L25).

```javascript
import "dotenv/config";
import senvf from "senvf";

if (!senvf.has("DATABASE_PASWORD")) {
  throw new Error("Database password not set");
}

connect({
  host: senvf.get("DATABASE_HOST", "127.0.0.1"),
  password: senvf.get("DATABASE_PASSWORD"),
});
```

## FAQs

**Can I set properties on `senvf`?**

No, the `senvf` object is frozen and is not meant to represent configuration. You _can_ workaround this by setting properties on `process.env` but it is **highly** advised against.

**Code I use relies on `process.env` having `x` property, how can I use `senvf`?**

Due to the nature of supply chain attacks, `senvf` does not allow any code to set values on `process.env`. Therefore change the code requiring `process.env` to instead accept an argument and pass the value in from `senvf.get`

**We use packages that sets values on `process.env` dynamically, how can I use `senvf`?**

Any properties set on `process.env` will instead automatically be set on `senvf` by proxy, you can access those values using `senvf.get`
