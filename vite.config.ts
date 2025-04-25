import react from '@vitejs/plugin-react'
import { glob } from 'glob'
import { extname, relative, resolve } from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import {viteStaticCopy} from 'vite-plugin-static-copy'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

import pkg from './package.json'

const peerDependencies = Object.keys(pkg.peerDependencies)

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		libInjectCss(),
		viteStaticCopy({
			targets: [
				{src: 'lib/assets/*', dest: 'assets'}
			]
		}),
		dts({
			tsconfigPath: './tsconfig.app.json',
			exclude: ['**/*.stories.tsx'],
		}),
	],
	resolve: {
		alias: {
			'@components': resolve(__dirname, './lib/components'),
			'@utils': resolve(__dirname, './lib/utils'),
			'@types': resolve(__dirname, './lib/types'),
			'@public': resolve(__dirname, './public'),
		},
	},
	build: {
		emptyOutDir: true,
		cssCodeSplit: true,
		cssMinify: false,
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			formats: ['es'],
		},
		rollupOptions: {
			external: [...peerDependencies, 'antd/locale/fr_FR', 'antd/es/table', 'antd/es/table/interface', 'react/jsx-runtime'],
			input: Object.fromEntries(
				glob
					.sync('lib/**/*.{ts,tsx}', { ignore: ['lib/**/*.d.ts', 'lib/**/*.stories.tsx', 'lib/**/*.test.{ts,tsx}', 'lib/**/*-utils.{ts,tsx}'] })
					.map((file) => [
						relative('lib', file.slice(0, file.length - extname(file).length)),
						fileURLToPath(new URL(file, import.meta.url)),
					]),
			),
			output: {
				preserveModules: true,
				entryFileNames: '[name].js',
				assetFileNames: 'assets/[name][extname]',
				globals: {
					react: 'React',
					'react-dom': 'React-dom',
					'react/jsx-runtime': 'react/jsx-runtime',
				},
			},
		},
	},
})
