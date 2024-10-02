import { InputRef } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { Search } from 'lucide-react'
import { RefObject } from 'react'

import { getLocalStorage } from '@utils/localStorage'

import { ColumnType, Filters, TableConfigState } from './Table-types'
import { SearchDropdown } from './_components/SearchDropdown/SearchDropdown'

export function loadStorage<T>(
	tableId: string,
	defaultFilters: Filters<keyof T>,
): TableConfigState<T> {
	const storage = getLocalStorage()
	const tableStorageKey = `${tableId}.table`

	if (storage.has(tableStorageKey)) {
		return storage.get(tableStorageKey)
	}

	const defaultConfig = { filters: defaultFilters, sorter: undefined, pagination: { size: 25 } }

	storage.set({ key: tableStorageKey, data: defaultConfig })

	return defaultConfig
}

/**
 * Generates a unique hash based on the input string. Useful to generate React keys.
 *
 * Source: https://stackoverflow.com/a/7616484
 */
export function generateRowKey(str: string) {
	let hash = 0,
		i,
		chr

	if (str.length === 0) return hash

	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i)
		hash = (hash << 5) - hash + chr
		hash |= 0 // Convert to 32bit integer
	}

	return hash
}

export function getRowClassname(index: number, theme: 'light' | 'dark'): string {
	if (index % 2 === 0) {
		return `even-row even-row__${theme}`
	} else {
		return `odd-row odd-row__${theme}`
	}
}

/* - - - Filters Dropdowns - - - */

/**
 * To be used only when the data source of the table is dynamic. You should handle the filtering and
 * sorting yourself with the API and the table's onChange props.
 */
export function getColumnSearchFilterConfig<T extends AnyObject>(
	inputRef: RefObject<InputRef>,
): Omit<ColumnType<T>, 'dataIndex'> {
	// Even though selectedKeys is used as an array, it corresponds to the current
	// filter value. It allows to have a controlled input value without declaring
	// a state ourselves.
	return {
		filterDropdown: ({ confirm, clearFilters, selectedKeys, setSelectedKeys }) => (
			<SearchDropdown
				confirm={confirm}
				clearFilters={clearFilters}
				selectedKeys={selectedKeys}
				setSelectedKeys={setSelectedKeys}
				inputRef={inputRef}
			/>
		),
		filterIcon: <Search size="16px" />,
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				// We need to delay the focus ever so slightly to make sure the component
				// is rendered when we focus.
				setTimeout(() => {
					inputRef.current?.focus()
				}, 100)
			}
		},
	}
}
