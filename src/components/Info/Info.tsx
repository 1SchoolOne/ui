import { Tooltip, TooltipProps } from 'antd'
import classnames from 'classnames'
import { InfoIcon } from 'lucide-react'
import { ReactNode } from 'react'

import { isNonEmptyObject } from '@utils/isNonEmptyObject'

import './Info-styles.less'

export interface InfoProps {
	children: ReactNode
	className?: string
	/** Set this to true or customize directly the tooltip props to display the info in a tooltip. */
	tooltip?: true | Omit<TooltipProps, 'title'>
}

export function Info(props: InfoProps) {
	const { children, className, tooltip } = props

	if (tooltip === true || isNonEmptyObject(tooltip)) {
		const tooltipProps = tooltip === true ? { title: children } : { ...tooltip, title: children }

		return (
			<Tooltip {...tooltipProps} className={classnames('schoolone-info--tooltip', className)}>
				<InfoIcon className="schoolone-info__icon" size={16} />
			</Tooltip>
		)
	}

	return (
		<div className={classnames('schoolone-info', className)}>
			<InfoIcon className="schoolone-info__icon" size={16} />
			<div className="schoolone-info__content">{children}</div>
		</div>
	)
}
