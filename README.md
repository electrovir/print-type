# print-type

A CLI for printing fully-expanded Typescript types from variables, type aliases, etc.

## Install

```sh
npm i -D print-type
```

Or, if you want to use this everywhere:

```sh
npm i -g print-type
```

## Usage

(`npx` should be omitted if you installed this package globally.)

```sh
npx print-type <path-to-file.ts> <name-to-expand>
```

-   `<name-to-expand>`: the name of the thing to expand, whether it be a variable, a type definition, anything.
-   `<path-to-file.ts>`: path to the file that contains the name of the thing to expand.

Example:

```sh
npx print-type src/my-file.ts MyAlias
```
