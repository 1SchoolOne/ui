import { Meta, StoryObj } from '@storybook/react'
import { Space, Typography } from 'antd'
import { EllipsisVertical, Grip, GripVertical, IceCreamCone, Menu } from 'lucide-react'

import { MainLayout } from '@components'

import { version as packageVersion } from '../../package.json'

import './MainLayout.stories-styles.less'

const meta: Meta<typeof MainLayout> = {
	title: 'Components/Main Layout',
	component: MainLayout,
}

export default meta

type Story = StoryObj<typeof MainLayout>

export const Example: Story = {
	args: {
		sidebarMenuProps: {
			items: [
				{ key: 'item-1', label: 'Item 1', icon: <EllipsisVertical size={16} /> },
				{
					key: 'item-2',
					label: 'Item 2',
					icon: <GripVertical size={16} />,
					children: [
						{
							key: 'item-2-categories',
							label: 'Categories',
							icon: <Menu size={16} />,
							children: [
								{ key: 'item-2-categories-italian', label: 'Italian' },
								{ key: 'item-2-categories-sorbet', label: 'Sorbet' },
							],
						},
						{
							key: 'item-2-flavors',
							label: 'Flavors',
							icon: <IceCreamCone size={16} />,
							children: [
								{ key: 'item-2-flavors-vanilla', label: 'Vanilla' },
								{ key: 'item-2-flavors-chocolate', label: 'Chocolate' },
							],
						},
					],
				},
				{ key: 'item-3', label: 'Item 3', icon: <Grip size={16} /> },
			],
		},
		sidebarFooter: (
			<Space direction="vertical" align="center">
				<Typography.Text>@1schoolone/ui</Typography.Text>
				<Typography.Text>v{packageVersion}</Typography.Text>
			</Space>
		),
		header: <h1>Header</h1>,
		children: <h1>Content</h1>,
	},
}
