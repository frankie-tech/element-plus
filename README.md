# {Plugin Name} - Simple Package Template

## About

A simple package template to build small JavaScript packages with TypeScript. Ideal for the developer who wants to make a package with 0 dependencies.

Uses:

-   Microbundle (pre-configured bundler)
-   Husky (formatting on commit)
-   Prettier (formatting)

## Documentation

Set up for TypeScript by default, but to change it to JavaScript, change the `package.json` file from:

```json
{
	"name": "simple-package",
	"version": "1.0.0",
	"source": "src/index.ts"
}
```

to:

```json
{
	"name": "simple-package",
	"version": "1.0.0",
	"source": "src/index.js"
}
```

Microbundle uses the source key to determine if it should use TypeScript or just good ol' fashioned JavaScript. If the source file has a `.ts` extension, then TypeScript will be used.

### Options

Check out the different Dev Dependencies to see what options there are, there are no options built in to the template itself.

### Questions

¯\\\_(ツ)\_/¯

### Templates

¯\\\_(ツ)\_/¯

### Issue Template

¯\\\_(ツ)\_/¯
