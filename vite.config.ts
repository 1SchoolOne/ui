import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'

import pkg from './package.json'

const peerDependencies = Object.keys(pkg.peerDependencies)

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		libInjectCss(),
		dts({
			tsconfigPath: './tsconfig.app.json',
			exclude: ['**/*.stories.tsx'],
		}),
	],
	resolve: {
		alias: {
			'@lib': resolve(__dirname, './lib'),
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
