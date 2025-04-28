import { Col, Row } from 'antd'
import { ReactNode } from 'react'

import './AuthLayout-styles.less'

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
	xl: 10,
	xxl: 10,
}

const rightPanelSpan: PanelSpan = {
	xs: 24,
	sm: 24,
	md: 12,
	lg: 12,
	xl: 14,
	xxl: 14,
}

interface AuthLayoutProps {
	children: ReactNode
	heroPanel?: ReactNode
	/** This is used as source on an <img /> tag */
	heroBackgroundSrc?: string
}

export function AuthLayout(props: AuthLayoutProps) {
	const { heroPanel, heroBackgroundSrc, children } = props

	return (
		<Row className="schoolone-auth-layout">
			<Col className="schoolone-auth-layout__hero-panel" {...leftPanelSpan}>
				<div className="schoolone-auth-layout__hero-panel__content">{heroPanel}</div>
				{heroBackgroundSrc && (
					<img
						className="schoolone-auth-layout__hero-panel__bg"
						src={heroBackgroundSrc}
						alt="brand mesh gradient"
					/>
				)}
			</Col>
			<Col className="schoolone-auth-layout__main-panel" {...rightPanelSpan}>
				{children}
			</Col>
		</Row>
	)
}
