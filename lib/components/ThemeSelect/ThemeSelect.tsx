import { DropDownProps, Dropdown } from 'antd'
import classnames from 'classnames'
import { MonitorIcon, MoonIcon, SunIcon } from 'lucide-react'
import { useContext, useState } from 'react'

import { ThemeContext } from '~/components/ThemeProvider/ThemeContext'

import './ThemeSelect-styles.less'

interface ThemeSelectProps {
	className?: string
	triggerClassName?: string
	placement?: DropDownProps['placement']
}

export function ThemeSelect(props: ThemeSelectProps) {
	const { className, triggerClassName, placement = 'bottom' } = props

	const [isOpen, setIsOpen] = useState(false)
	const { themePreference, setThemePreference } = useContext(ThemeContext)

	const getActiveIcon = () => {
		switch (themePreference) {
			case 'light':
				return <SunIcon size={16} />
			case 'dark':
				return <MoonIcon size={16} />
			case 'system':
				return <MonitorIcon size={16} />
		}
	}

	return (
		<Dropdown
			className={classnames('schoolone-theme-select', className)}
			trigger={['click']}
			onOpenChange={setIsOpen}
			open={isOpen}
			placement={placement}
			menu={{
				items: [
					{
						key: 'light',
						label: 'Clair',
						icon: <SunIcon size={16} />,
						onClick: () => setThemePreference('light'),
					},
					{
						key: 'dark',
						label: 'Sombre',
						icon: <MoonIcon size={16} />,
						onClick: () => setThemePreference('dark'),
					},
					{
						key: 'system',
						label: 'Système',
						icon: <MonitorIcon size={16} />,
						onClick: () => setThemePreference('system'),
					},
				],
			}}
		>
			<div
				className={classnames(
					'schoolone-theme-select__trigger',
					{
						'schoolone-theme-select__trigger--is-open': isOpen,
					},
					triggerClassName,
				)}
			>
				<i className="schoolone-theme-select__trigger__icon">{getActiveIcon()}</i>
			</div>
		</Dropdown>
	)
}
