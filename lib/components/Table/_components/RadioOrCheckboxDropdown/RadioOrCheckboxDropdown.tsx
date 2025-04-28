import { Button, Checkbox, Radio, Space } from 'antd'
import { FilterConfirmProps } from 'antd/es/table/interface'
import classnames from 'classnames'

import { generateRowKey } from '../../Table-utils'

interface RadioOrCheckboxDropdownProps<T = string | number | boolean> {
	/**
	 * Should it use checkboxes instead of radios.
	 */
	useCheckbox?: true
	options: Array<RadioOrCheckboxOption<T>>
	selectedKeys: Array<React.Key>
	setSelectedKeys: (selectedKeys: Array<React.Key>) => void
	clearFilters: (() => void) | undefined
	confirm: (param?: FilterConfirmProps) => void
}

export interface RadioOrCheckboxOption<T = string | number | boolean> {
	label: string
	value: T
}

export function RadioOrCheckboxDropdown(props: RadioOrCheckboxDropdownProps) {
	const { useCheckbox, options, selectedKeys, setSelectedKeys, clearFilters, confirm } = props

	return (
		<Space
			className={classnames('schoolone-filter-dropdown', {
				radio: !useCheckbox,
				checkbox: useCheckbox,
			})}
			direction="vertical"
		>
			{useCheckbox ? (
				<Checkbox.Group value={selectedKeys} onChange={setSelectedKeys}>
					<Space direction="vertical" size="small">
						{options.map(({ label, value }) => (
							<Checkbox key={generateRowKey(value + label)} value={value}>
								{label}
							</Checkbox>
						))}
					</Space>
				</Checkbox.Group>
			) : (
				<Radio.Group>
					<Space direction="vertical" size="small">
						{options.map(({ label, value }) => (
							<Radio key={generateRowKey(value + label)} value={value}>
								{label}
							</Radio>
						))}
					</Space>
				</Radio.Group>
			)}
			<Space className="schoolone-filter-dropdown__btns-container">
				<Button
					type="link"
					size="small"
					onClick={() => {
						clearFilters?.()
						// confirm() is important here because if we don't call it the input
						// won't be cleared properly.
						confirm()
					}}
				>
					Réinitialiser
				</Button>
				<Button type="primary" size="small" onClick={() => confirm()}>
					OK
				</Button>
			</Space>
		</Space>
	)
}
