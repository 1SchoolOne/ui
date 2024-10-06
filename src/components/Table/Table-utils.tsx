import { InputRef } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { TableRef } from 'antd/es/table'
import { Search } from 'lucide-react'
import { RefObject, useMemo } from 'react'

import { getLocalStorage } from '@utils/localStorage'

import { ColumnType, Filters, RenderHeaderParams, TableConfigState } from './Table-types'
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

/**
 * Calculate the table height based on its parent's height and the table header height, if displayed.
 */
export function useTableHeight(tableRef: RefObject<TableRef>, tableHeader: boolean) {
	const tableHeight = useMemo(() => {
		const node = tableRef.current
		const clientRect = node?.nativeElement.getBoundingClientRect()

		const top = clientRect?.top ?? 0
		// 32 - 16 is the height of the table header minus the bottom margin
		const height = window.innerHeight - top - 55

		return tableHeader ? height - (32 - 16) : height
	}, [tableRef, tableHeader])

	return tableHeight
}

// TODO: need a fix. `computedStyleMap` is not supported in Firefox as of now
export function getScrollX(tableRef: RefObject<TableRef>) {
	if (tableRef.current !== null) {
		const tableContainer = tableRef.current.nativeElement.parentElement as HTMLElement

		const totalWidth = tableContainer.getBoundingClientRect().width
		const { value: padding } = tableContainer.computedStyleMap().get('padding-left') as CSSUnitValue

		return totalWidth - padding
	}
}

export function useTableHeader(params: RenderHeaderParams) {
	const { resetFiltersButton, showHeader, renderCallback } = params

	if (!resetFiltersButton && !showHeader) {
		return null
	}

	return <div className="schoolone-table-header">{renderCallback(resetFiltersButton)}</div>
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
