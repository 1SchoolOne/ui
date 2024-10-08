import { Meta, StoryObj } from '@storybook/react'

import { Info } from '@components'

import './Info.stories-styles.less'

const meta: Meta<typeof Info> = {
	title: 'Components/Info',
	component: Info,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof Info>

export const SimpleInfo: Story = {
	args: {
		children: <p>Dummy text lorem ipsum</p>,
	},
}

export const TooltipInfo: Story = {
	args: {
		tooltip: { placement: 'right' },
		children: <p>This is the info content in tooltip</p>,
	},
}
