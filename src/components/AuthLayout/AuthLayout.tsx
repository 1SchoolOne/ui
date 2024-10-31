import { Col, Row } from 'antd'
import { ReactNode } from 'react'

import './AuthLayout-styles.less'

const meshGradientUrl = new URL('../../assets/brand-mesh-gradient.png', import.meta.url).href

interface PanelSpan {
	xs: number
	sm: number
	md: number
	lg: number
	xl: number
	xxl: number
}

const leftPanelSpan: PanelSpan = {
	xs: 0,
	sm: 0,
	md: 12,
	lg: 12,
	xl: 14,
	xxl: 14,
}

const rightPanelSpan: PanelSpan = {
	xs: 24,
	sm: 24,
	md: 12,
	lg: 12,
	xl: 10,
	xxl: 10,
}

interface AuthLayoutProps {
	children: ReactNode
	heroPanel?: ReactNode
}

export function AuthLayout(props: AuthLayoutProps) {
	const { heroPanel, children } = props

	return (
		<Row className="schoolone-auth-layout">
			<Col className="schoolone-auth-layout__hero-panel" {...leftPanelSpan}>
				<div className="schoolone-auth-layout__hero-panel__content">{heroPanel}</div>
				<img
					className="schoolone-auth-layout__hero-panel__bg"
					src={meshGradientUrl}
					alt="brand mesh gradient"
				/>
			</Col>
			<Col className="schoolone-auth-layout__main-panel" {...rightPanelSpan}>
				{children}
			</Col>
		</Row>
	)
}
