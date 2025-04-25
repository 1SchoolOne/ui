import { Meta, StoryObj } from '@storybook/react'
import { Flex, Typography } from 'antd'
import { useContext } from 'react'

import { MainLayout, ThemeContext, ThemeProvider, ThemeSelect } from '@components'

const meta: Meta<typeof ThemeProvider> = {
	title: 'Contexts/Theme',
	component: ThemeProvider,
}

export default meta

type Story = StoryObj<typeof ThemeProvider>

function ThemeInfo() {
	const { activeTheme, themePreference } = useContext(ThemeContext)

	return (
		<Flex justify="center" style={{ padding: '0 1rem' }} vertical>
			<Typography.Title>Theme provider</Typography.Title>
			<Typography.Text>Theme preference: {themePreference}</Typography.Text>
			<Typography.Text>Active theme: {activeTheme}</Typography.Text>
		</Flex>
	)
}

export const Example: Story = {
	args: {
		children: (
			<MainLayout
				header={
					<Flex align="center" gap={8}>
						<Typography.Text>Theme select:</Typography.Text>
						<ThemeSelect />
					</Flex>
				}
				sidebarMenuProps={{
					items: [
						{ key: 'item-1', label: 'Item 1' },
						{
							key: 'item-2',
							label: 'Item 2',
						},
						{ key: 'item-3', label: 'Item 3' },
					],
				}}
			>
				<ThemeInfo />
			</MainLayout>
		),
	},
}
