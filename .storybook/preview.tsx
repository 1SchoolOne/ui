import type { Preview } from '@storybook/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

import { ThemeProvider } from '../lib/components/ThemeProvider/ThemeProvider'

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 0 } } })

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
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>
					<Story />
				</ThemeProvider>
			</QueryClientProvider>
		),
	],
}

export default preview
