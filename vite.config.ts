import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

import pkg from './package.json'

const peerDependencies = Object.keys(pkg.peerDependencies)

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
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
		assetsInlineLimit: 0,
		emptyOutDir: true,
		cssMinify: false,
		cssCodeSplit: false,
		lib: {
			entry: resolve(__dirname, 'lib/index.ts'),
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
