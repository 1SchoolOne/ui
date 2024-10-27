/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

const peerDependencies = Object.keys(pkg.peerDependencies)

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), dts({ tsconfigPath: './tsconfig.app.json', exclude: ['**/*.stories.tsx'] })],
	test: {
		dir: 'src',
		globals: true,
	},
	resolve: {
		alias: {
			'@components': resolve(__dirname, './src/components'),
			'@utils': resolve(__dirname, './src/utils'),
			'@types': resolve(__dirname, './src/types'),
			'@public': resolve(__dirname, './public'),
		},
	},
	build: {
		copyPublicDir: false,
		emptyOutDir: true,
		cssMinify: false,
		cssCodeSplit: false,
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'index',
			formats: ['es'],
		},
		rollupOptions: {
			external: [...peerDependencies, 'react/jsx-runtime'],
			output: {
				entryFileNames: '[name].js',
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === 'style.css') {
						return 'index.css'
					}

					return assetInfo.name ?? ''
				},
				globals: {
					react: 'React',
					'react-dom': 'React-dom',
					'react/jsx-runtime': 'react/jsx-runtime',
				},
			},
		},
	},
})
