import { Input, Space } from 'antd'

import { Info } from '@components'

import './GlobalSearch-styles.less'

interface GlobalSearchProps {
	searchedFields: Array<string>
	value: string
	onChange: (value: string) => void
}

export function GlobalSearch(props: GlobalSearchProps) {
	const { searchedFields, value, onChange } = props

	return (
		<Space className="schoolone-table-global-search" align="center">
			<Info tooltipContentClassName="schoolone-table-global-search__tooltip" tooltip>
				<h4>Recherche globale</h4>
				<div>
					Ignore les filtres et recherche dans les champs suivants :
					<ul>
						{searchedFields.map((field) => (
							<li key={field}>{field}</li>
						))}
					</ul>
				</div>
			</Info>
			<Input
				placeholder="Recherche globale"
				value={value}
				onChange={({ target }) => onChange(target.value)}
			/>
		</Space>
	)
}
