import { InputRef } from 'antd'
import { TableRef } from 'antd/es/table'
import { Search } from 'lucide-react'
import { RefObject, useCallback, useEffect, useMemo, useState } from 'react'

import { AnyObject } from '@lib/types'

import { getLocalStorage } from '@lib/utils/localStorage'

import {
	ColumnFilterType,
	ColumnStaticFilterType,
	ColumnType,
	DataFetcher,
	DataFetcherParams,
	DataSource,
	FetchResult,
	Filters,
	RenderTableHeaderParams,
	StaticDataSource,
	TableConfigState,
} from './Table-types'
import { GlobalSearch } from './_components/GlobalSearch/GlobalSearch'
import {
	RadioOrCheckboxDropdown,
	RadioOrCheckboxOption,
} from './_components/RadioOrCheckboxDropdown/RadioOrCheckboxDropdown'
import { ResetFiltersButton } from './_components/ResetFiltersButton/ResetFiltersButton'
import { SearchDropdown } from './_components/SearchDropdown/SearchDropdown'

/** @internal */
export function useConditionalDataFetcher<T extends AnyObject>(params: {
	tableId: string
	dataSource: DataSource<T>
	fetchParams: DataFetcherParams<T>
	customDataFetcher?: DataFetcher<T>
}): FetchResult<T> {
	const { dataSource, fetchParams, tableId, customDataFetcher } = params

	const hasCustomFetcher = !!customDataFetcher

	const defaultFetchResult = useDefaultDataFetcher({
		tableId,
		dataSource,
		fetchParams,
		skip: hasCustomFetcher,
	})

	return useMemo(() => {
		if (hasCustomFetcher && customDataFetcher) {
			return customDataFetcher(fetchParams)
		}

		return defaultFetchResult
	}, [hasCustomFetcher, customDataFetcher, fetchParams, defaultFetchResult])
}

function useDefaultDataFetcher<T extends AnyObject>(params: {
	tableId: string
	dataSource: DataSource<T>
	fetchParams: DataFetcherParams<T>
	skip?: boolean
}): FetchResult<T> {
	const { dataSource, fetchParams, skip } = params

	const [data, setData] = useState<StaticDataSource<T> | null>(null)
	const [totalCount, setTotalCount] = useState(0)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<Error | null>(null)

	const fetchData = useCallback(async () => {
		if (skip) return

		setIsLoading(true)
		setError(null)

		try {
			if (typeof dataSource !== 'function') {
				setData(dataSource)
				setTotalCount(dataSource.length)
				setIsLoading(false)
				return
			}

			const result = await dataSource({
				filters: fetchParams.filters,
				sorter: fetchParams.sorter,
				pagination: fetchParams.pagination,
				currentPage: fetchParams.currentPage,
				globalSearch: fetchParams.globalSearch,
			})

			setData(result.data)
			setTotalCount(result.totalCount)
		} catch (err) {
			setError(err instanceof Error ? err : new Error(String(err)))
		} finally {
			setIsLoading(false)
		}
	}, [
		skip,
		dataSource,
		fetchParams.filters,
		fetchParams.sorter,
		fetchParams.pagination,
		fetchParams.currentPage,
		fetchParams.globalSearch,
		...(fetchParams.refetchTriggers || []),
	])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return {
		data,
		totalCount,
		isLoading,
		error,
		refetch: fetchData,
	}
}

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

	const defaultConfig: TableConfigState<T> = {
		filters: defaultFilters,
		sorter: undefined,
		pagination: { size: 25 },
	}

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
	if (tableRef?.current) {
		const tableContainer = tableRef.current.nativeElement.parentElement as HTMLElement

		const totalWidth = tableContainer.getBoundingClientRect().width
		const computedStyle = window.getComputedStyle(tableContainer)
		const paddingLeft = parseFloat(computedStyle.getPropertyValue('padding-left'))

		return totalWidth - paddingLeft
	}
}

/** @internal */
export function renderTableHeader<
	T extends AnyObject,
	C extends readonly ColumnType<T>[] = ColumnType<T>[],
>(params: RenderTableHeaderParams<T, C>) {
	const { resetFilters, globalSearch, renderCallback } = params

	if (!resetFilters.enabled && !globalSearch.enabled) {
		return null
	}

	const globalSearchNode = globalSearch.enabled ? (
		<GlobalSearch
			searchedFields={globalSearch.searchedFields}
			onChange={globalSearch.setValue}
			value={globalSearch.value}
		/>
	) : null

	const resetFiltersNode = resetFilters.enabled ? (
		<ResetFiltersButton onClick={resetFilters.onClick} />
	) : null

	return (
		<div className="schoolone-table-header">
			{renderCallback(globalSearchNode, resetFiltersNode)}
		</div>
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
