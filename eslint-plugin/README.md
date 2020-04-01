# eslint-plugin-y

cs plugin

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-y`:

```
$ npm install eslint-plugin-y --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-y` globally.

## Usage

Add `y` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "y"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "y/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





