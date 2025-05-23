import type { Preview } from '@storybook/react'
import React from 'react'

import { ThemeProvider } from '../lib/components/ThemeProvider/ThemeProvider'

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
	decorators: [
		(Story) => (
				<ThemeProvider>
					<Story />
				</ThemeProvider>
		),
	],
}

export default preview
