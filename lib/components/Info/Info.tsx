import { Tooltip, TooltipProps } from 'antd'
import classnames from 'classnames'
import { InfoIcon } from 'lucide-react'
import { ReactNode } from 'react'

import { isNonEmptyObject } from '~/utils/isNonEmptyObject'

import './Info-styles.less'

type InfoProps = InfoInlineProps | InfoTooltipProps

interface InfoCommonProps {
	children: ReactNode
	className?: string
}

interface InfoInlineProps extends InfoCommonProps {
	/** Set this to true or customize directly the tooltip props to display the info in a tooltip. */
	tooltip?: never
	tooltipContentClassName?: never
}

interface InfoTooltipProps extends InfoCommonProps {
	tooltip: true | Omit<TooltipProps, 'title'>
	tooltipContentClassName?: string
}

export function Info(props: InfoProps) {
	const { children, className, tooltip, tooltipContentClassName } = props

	if (tooltip === true || isNonEmptyObject(tooltip)) {
		const tooltipProps = tooltip === true ? { title: children } : { ...tooltip, title: children }

		return (
			<Tooltip
				{...tooltipProps}
				className={classnames('schoolone-info--tooltip', className)}
				rootClassName={classnames('schoolone-info--tooltip__content', tooltipContentClassName)}
			>
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
