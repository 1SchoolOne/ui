import { Meta, StoryObj } from '@storybook/react'
import { Button, Form, Input, Space, Typography } from 'antd'

import { AuthLayout } from '~/components/AuthLayout/AuthLayout'

import './AuthLayout.stories-styles.less'

const meta: Meta<typeof AuthLayout> = {
	title: 'Components/AuthLayout',
	component: AuthLayout,
	tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof AuthLayout>

export const Example: Story = {
	args: {
		children: <h1 className="example-story">Main Panel</h1>,
		heroPanel: <h1 className="example-story">Hero Panel</h1>,
	},
}

export const Login: Story = {
	args: {
		children: (
			<Space direction="vertical" size="large">
				<Typography.Title>Login</Typography.Title>
				<Form layout="vertical">
					<Form.Item name="email" label="Email">
						<Input />
					</Form.Item>
					<Form.Item name="password" label="Password">
						<Input.Password />
					</Form.Item>
					<Button type="primary">Login</Button>
				</Form>
			</Space>
		),
		heroPanel: (
			<Space className="login-hero-content" direction="vertical" size="large">
				<Typography.Title>Lorem ipsum</Typography.Title>
				<Typography.Paragraph>
					Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
					commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
					dolore eu fugiat nulla pariatur
				</Typography.Paragraph>
			</Space>
		),
	},
}
