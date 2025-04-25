import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { libInjectCss } from 'vite-plugin-lib-inject-css'
import { viteStaticCopy } from 'vite-plugin-static-copy'

import pkg from './package.json'

const peerDependencies = Object.keys(pkg.peerDependencies)

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		libInjectCss(),
		viteStaticCopy({
			targets: [{ src: 'lib/assets/*', dest: 'assets' }],
		}),
		dts({
			tsconfigPath: './tsconfig.app.json',
			exclude: ['**/*.stories.tsx'],
		}),
	],
	resolve: {
		alias: {
			'~': resolve('./lib'),
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
			external: [
				...peerDependencies,
				'antd/locale/fr_FR',
				'antd/es/table',
				'antd/es/table/interface',
				'react/jsx-runtime',
			],
			output: {
				preserveModules: true,
				entryFileNames: '[name].js',
				assetFileNames: ({ names }) => {
					const assetFileName = names[0].split('/')
					return `assets/${assetFileName[assetFileName.length - 1]}`
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
