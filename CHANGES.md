# Changes

## 0.5.9

- 🍏 [`95b27fa`](https://github.com/mochify-js/mochify/commit/95b27fa088070dbedc9f5b92fa854ccc69e88f0f)
  Add support for "require" config
- ✨ [`dbab7f2`](https://github.com/mochify-js/mochify/commit/dbab7f2ac845aff4e83ea572379127061d132849)
  Run installed version of tsc in GH action

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-11-05._

## 0.5.8

- 🍏 [`a273579`](https://github.com/mochify-js/mochify/commit/a27357991f241e82706a5a6ad3d5f733d0c3e2db)
  Install custom inspect on DOM objects
- 🍏 [`e7567e4`](https://github.com/mochify-js/mochify/commit/e7567e46432f6737f79eeeb94ad326696f2dc7de)
  Rewrite data serialization protocol
- ✨ [`8ebf1e5`](https://github.com/mochify-js/mochify/commit/8ebf1e57baf1c2c4fd73f947e1442a21c289e41a)
  Remove node 16, add node 22
- ✨ [`481b6b5`](https://github.com/mochify-js/mochify/commit/481b6b5e270002c31069afa9d2f4a293f11e24c7)
  Update mocha
- ✨ [`2874b57`](https://github.com/mochify-js/mochify/commit/2874b57b32d4b22906f2c187847db598dddc2484)
  Modernize client.js

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-06-17._

## 0.5.7

- 🐛 [`58c0f28`](https://github.com/mochify-js/mochify/commit/58c0f28bf68db4a056073e250ad574f1576a2138)
  Serialize and deserialize functions and special values

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-06-14._

## 0.5.6

- 🐛 [`7e79b8d`](https://github.com/mochify-js/mochify/commit/7e79b8d8c7098ce3a8ccf687593f775539e7bf4a)
  Remove circular references and deep copy

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-06-12._

## 0.5.5

- 🐛 [`46d4b4b`](https://github.com/mochify-js/mochify/commit/46d4b4b13578160829cc4a0f3d809037fb80c2b9)
  Remove circular dependencies from objects sent over the wire
- 🐛 [`a33f7a7`](https://github.com/mochify-js/mochify/commit/a33f7a79b113219237d4bf9b5161fb66f83c243a)
  Do not use the failure count as exit code
- ✨ [`ed2b110`](https://github.com/mochify-js/mochify/commit/ed2b1105b6644268a0828b05b23cb063c8328b81)
  Add onunhandledrejection handler
- ✨ [`9cb6c5a`](https://github.com/mochify-js/mochify/commit/9cb6c5a34dffd4860af559b215b0eab696eda470)
  Call `write` directly in global error handler

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-05-27._

## 0.5.4

- [`64667d9`](https://github.com/mochify-js/mochify/commit/64667d92689f608169d63c1a5a26063844af7c8e)
  Fix stack-mapper internal frame filtering

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-01-03._

## 0.5.3

- [`0590c3f`](https://github.com/mochify-js/mochify/commit/0590c3f27f5a8d0d044b94559882738286d02800)
  Forward bundle command stderr

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2024-01-03._

## 0.5.2

- [`2940d8c`](https://github.com/mochify-js/mochify/commit/2940d8c05fc0973bf4d8b459321ce5c00a750cee)
  Remove test framework internal frames from stack traces

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2023-12-29._

## 0.5.1

- [`f42f066`](https://github.com/mochify-js/mochify/commit/f42f0665684908abdc73977c1e0a69fb80b0956c)
  Improve stack trace mapping

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2023-12-28._

## 0.5.0

- [`9a656eb`](https://github.com/mochify-js/mochify/commit/9a656ebc1aa741932177cd7288edb4b6382a90df)
  Add bundle_stdin option
- [`d547799`](https://github.com/mochify-js/mochify/commit/d5477997eaa62e7bc55d0b2e391b00a58b209075)
  Sort resolved specs to align with mocha behavior
- [`4902bb6`](https://github.com/mochify-js/mochify/commit/4902bb60b0f78fe056b689fca090957ced213ff9)
  Add missing types to resolve-bundle
- [`994a054`](https://github.com/mochify-js/mochify/commit/994a05499cd57fc81f6068b81b83f644c645cf6d)
  Upgrade glob

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2023-12-27._

## 0.4.0

- Initial release

_Released by [Maximilian Antoni](https://github.com/mantoni) on 2023-12-24._
