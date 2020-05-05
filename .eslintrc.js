module.exports = {
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
	},
	env: {
		browser: true,
		es6: true,
	},
	plugins: [
		'@typescript-eslint',
		// 'compat',
		'import',
		'react',
	],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/eslint-recommended',
		'plugin:@typescript-eslint/recommended',
		// 'plugin:compat/recommended',
		'plugin:import/errors',
		'plugin:import/warnings',
		'plugin:import/typescript',
		'plugin:import/recommended',
		'plugin:react/recommended',
	],
	rules: {
		// indent
		indent: ['error', 'tab', {
			SwitchCase: 1,
		}],
		'@typescript-eslint/indent': ['error', 'tab', {
			SwitchCase: 1,
		}],

		'quotes': ['error', 'single'
		],
		'object-curly-spacing': ['error', 'always'
		],
		'semi': ['error', 'never'
		],
		'comma-dangle': ['error', 'always-multiline'
		],
		// typescript
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/semi': ['error', 'never'
		],
		'@typescript-eslint/member-delimiter-style': ['error',
			{
				multiline: {
					delimiter: 'none',
				},
			}
		],
		'@typescript-eslint/no-empty-function': 'off',
		// import
		'import/no-unresolved': ['error',
			{
				ignore: [
					'\\?module$',
				],
			}
		],
		'import/order': ['error',
			{
				'newlines-between': 'always',
			}
		],
		// jsx
		'react/prop-types': 'off',
		'react/react-in-jsx-scope': 'off',
		'react/display-name': 'off',
		'react/no-string-refs': 'off',
		'react/no-unknown-property': ['error',
			{
				ignore: ['class'
				],
			}
		],
		'react/jsx-wrap-multilines': ['error',
			{
				declaration: 'parens-new-line',
				assignment: 'parens-new-line',
				return: 'parens-new-line',
				arrow: 'parens-new-line',
				condition: 'parens-new-line',
				logical: 'parens-new-line',
				prop: 'parens-new-line',
			}
		],
		'react/jsx-max-props-per-line': ['error',
			{
				maximum: 2,
			}
		],
		'react/jsx-first-prop-new-line': ['error', 'multiline'
		],
		'react/jsx-closing-tag-location': 'error',
		'react/jsx-closing-bracket-location': 'error',
		'react/jsx-one-expression-per-line': ['error',
			{
				allow: 'literal',
			}
		],
		'react/jsx-max-depth': ['error',
			{
				max: 5,
			}
		],
	},
	overrides: [
		{
			files: [
				'scripts/*',
				'_templates/**',
				'*.js',
			],
			env: {
				node: true,
			},
			rules: {
				'@typescript-eslint/no-var-requires': 'off',
				'no-console': 'off',
			},
		},
	],
	settings: {
		'import/resolver': {
			'typescript': {},
		},
		react: {
			pragma: 'h',
			version: '16.0',
		},
	},
}
