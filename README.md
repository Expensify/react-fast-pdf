# `react-fast-pdf`

Awesome PDF viewer, that combines the best of others into one tool.

![Example](example/public/example.gif)

# Features

- Simple usage.
- Loads/previews PDF files of any size.
- Performance optimized.
- Easy customized.
- Support by Expensify.

# Local testing

Actually, for testing changes locally, we need to connect `example` to the code from `src` directory (_**NPM** by default_).

Update a few fields in `example` directory:
1. `package.json`:
```diff
-"react-fast-pdf": "^1.*"
+"react-fast-pdf": "../src"
```

2. `tsconfig.json`:
```diff
-"rootDir": "./src"
+"rootDir": "../"
```

3. Run `npm i` in the directory. It should update `package-lock.json`.

The final result has to look like in this [commit](https://github.com/Expensify/react-fast-pdf/pull/9/commits/29334948a936def7a1ba967aa632f6f5e951a3cb).

# Deploying

This repo automatically publishes to NPM when PRs are merged to main.

# Contributing

Right now, contributions to this library are done under https://github.com/Expensify/App. Please refer to that repo and all it's guidelines for contributing.
