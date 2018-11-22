# ts-add-module-exports

Adds `module.exports = exports['default'];` for `exports.default`, for CommonJS default export interoperability.

The TypeScript compiler transforms

```
export default main;
```

into

```
exports.default = main;
```

So, node consumers would have to do

```
require("./main").default
```

instead of

```
require("./main")
```

This script adds `module.exports = exports['default'];` if _only_ the `exports.default` expression exists.

Like [babel-plugin-add-module-exports](https://www.npmjs.com/package/babel-plugin-add-module-exports), but for a TS build.
