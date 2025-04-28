import { InputRef } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { TableRef } from 'antd/es/table'
import { Search } from 'lucide-react'
import { ReactNode, RefObject, useMemo, useState } from 'react'

import { getLocalStorage } from '@lib/utils/localStorage'
import { useDebounce } from '@lib/utils/useDebounce'

import {
	ColumnFilterType,
	ColumnStaticFilterType,
	ColumnType,
	Filters,
	RenderHeaderParams,
	TableConfigState,
	UseGlobalSearchParams,
} from './Table-types'
import { GlobalSearch } from './_components/GlobalSearch/GlobalSearch'
import {
	RadioOrCheckboxDropdown,
	RadioOrCheckboxOption,
} from './_components/RadioOrCheckboxDropdown/RadioOrCheckboxDropdown'
import { SearchDropdown } from './_components/SearchDropdown/SearchDropdown'

/** @internal */
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

	storage.set(tableStorageKey, defaultConfig)

	return defaultConfig
}

/**
 * Generates a unique hash based on the input string. Useful to generate React keys.
 *
 * Source: https://stackoverflow.com/a/7616484
 * @internal
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

/** @internal */
export function getRowClassname(index: number, theme: 'light' | 'dark'): string {
	if (index % 2 === 0) {
		return `even-row even-row__${theme}`
	} else {
		return `odd-row odd-row__${theme}`
	}
}

/**
 * Calculate the table height based on its parent's height and the table header height, if displayed.
 * @internal
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
/** @internal */
export function getScrollX(tableRef: RefObject<TableRef>) {
	if (tableRef.current !== null) {
		const tableContainer = tableRef.current.nativeElement.parentElement as HTMLElement

		const totalWidth = tableContainer.getBoundingClientRect().width
		const { value: padding } = tableContainer.computedStyleMap().get('padding-left') as CSSUnitValue

		return totalWidth - padding
	}
}

/** @internal */
export function useTableHeader(params: RenderHeaderParams) {
	const { resetFiltersButton, globalSearchInput, showHeader, renderCallback } = params

	if (!showHeader || (!resetFiltersButton && !globalSearchInput)) {
		return null
	}

	return (
		<div className="schoolone-table-header">
			{renderCallback(resetFiltersButton, globalSearchInput)}
		</div>
	)
}

/** @internal */
export function useGlobalSearch<T extends AnyObject, C extends readonly ColumnType<T>[]>(
	params: UseGlobalSearchParams<T, C> | undefined,
): {
	globalSearchInput: ReactNode
	globalSearchValue: string
} {
	const [value, setValue] = useState('')
	const debouncedValue = useDebounce(value, params?.debounceDelay ?? 750)

	if (!params) {
		return {
			globalSearchInput: null,
			globalSearchValue: '',
		}
	}

	return {
		globalSearchInput: (
			<GlobalSearch searchedFields={params.searchedFields} value={value} onChange={setValue} />
		),
		globalSearchValue: debouncedValue,
	}
}

/** @internal */
export function defaultRenderHeaderCallback(
	resetFiltersButton?: ReactNode,
	globalSearchInput?: ReactNode,
) {
	return (
		<>
			{globalSearchInput}
			{resetFiltersButton}
		</>
	)
}

/* - - - Filters Dropdowns - - - */

/**
 * WARN: To be used only when the data source of the table is dynamic. You should handle the filtering and
 * sorting yourself with the API and the table's onChange props.
 */
export function getSearchFilterConfig<T extends AnyObject>(
	inputRef: RefObject<InputRef>,
): ColumnFilterType<T> {
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

/**
 * WARN: To be used only when the data source of the table is static. It handles the filtering process.
 */
export function getStaticSearchFilterConfig<T extends AnyObject>({
	dataIndex,
	inputRef,
}: {
	dataIndex: Extract<keyof T, string>
	inputRef: RefObject<InputRef>
}): ColumnStaticFilterType<T> {
	const baseConfig = getSearchFilterConfig(inputRef)

	return {
		...baseConfig,
		onFilter: (value, record) => {
			const recordValue = record[dataIndex]

			if (typeof value !== 'boolean') {
				return String(recordValue).toLowerCase().includes(String(value).toLowerCase())
			}

			return recordValue === value
		},
	}
}

/**
 * WARN: To be used only when the data source of the table is dynamic. You should handle the filtering and
 * sorting yourself with the API and the table's onChange props.
 */
export function getRadioFilterConfig<T extends AnyObject>(
	options: Array<RadioOrCheckboxOption>,
): ColumnFilterType<T> {
	return {
		filterDropdown: ({ confirm, clearFilters, selectedKeys, setSelectedKeys }) => (
			<RadioOrCheckboxDropdown
				options={options}
				selectedKeys={selectedKeys}
				setSelectedKeys={setSelectedKeys}
				clearFilters={clearFilters}
				confirm={confirm}
			/>
		),
	}
}

/**
 * WARN: To be used only when the data source of the table is static. It handles the filtering process.
 */
export function getStaticRadioFilterConfig<T extends AnyObject>({
	dataIndex,
	options,
}: {
	dataIndex: Extract<keyof T, string>
	options: Array<RadioOrCheckboxOption>
}): ColumnStaticFilterType<T> {
	const baseConfig = getRadioFilterConfig(options)

	return {
		...baseConfig,
		onFilter: (value, record) => record[dataIndex] === value,
	}
}

/**
 * WARN: To be used only when the data source of the table is dynamic. You should handle the filtering and
 * sorting yourself with the API and the table's onChange props.
 */
export function getCheckboxFilterConfig<T extends AnyObject>(
	options: Array<RadioOrCheckboxOption>,
): ColumnFilterType<T> {
	return {
		filterDropdown: ({ confirm, clearFilters, selectedKeys, setSelectedKeys }) => (
			<RadioOrCheckboxDropdown
				useCheckbox={true}
				options={options}
				selectedKeys={selectedKeys}
				setSelectedKeys={setSelectedKeys}
				clearFilters={clearFilters}
				confirm={confirm}
			/>
		),
	}
}

/**
 * WARN: To be used only when the data source of the table is static. It handles the filtering process.
 */
export function getStaticCheckboxFilterConfig<T extends AnyObject>({
	dataIndex,
	options,
}: {
	dataIndex: Extract<keyof T, string>
	options: Array<RadioOrCheckboxOption>
}): ColumnStaticFilterType<T> {
	const baseConfig = getRadioFilterConfig(options)

	return {
		...baseConfig,
		onFilter: (value, record) => record[dataIndex] === value,
	}
}
