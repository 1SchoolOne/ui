import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import jsdoc from 'eslint-plugin-jsdoc'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config({
	ignores: ['dist'],
	extends: [
		js.configs.recommended,
		...tseslint.configs.recommended,
		jsdoc.configs['flat/stylistic-typescript'],
		prettier,
	],
	files: ['lib/**/*.{ts,tsx}'],
	languageOptions: {
		ecmaVersion: 2020,
		globals: globals.browser,
	},
	plugins: {
		'react-hooks': reactHooks,
		'react-refresh': reactRefresh,
		jsdoc,
	},
	rules: {
		...reactHooks.configs.recommended.rules,
		'jsdoc/lines-before-block': 'off',
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				args: 'all',
				argsIgnorePattern: '^_',
			},
		],
		'@typescript-eslint/no-require-imports': 'error',
		'@typescript-eslint/no-explicit-any': 'warn',
		semi: ['error', 'never'],
	},
})
