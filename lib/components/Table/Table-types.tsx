import { TableProps as AntdTableProps } from 'antd'
import { TableColumnType } from 'antd'
import { FilterValue as AntdFilterValue, SortOrder } from 'antd/es/table/interface'
import { ReactNode } from 'react'

import { AnyObject } from '@lib/types'

export interface FetchResult<T> {
	data: Array<T> | null | undefined
	totalCount: number
	isLoading: boolean
	error: Error | null
	refetch: () => void
}

export interface DataFetcherParams<T> {
	filters: Filters<keyof T> | undefined
	sorter: Sorter<T> | undefined
	pagination: Pagination | undefined
	currentPage: number
	globalSearch?: string
	refetchTriggers?: unknown[]
}

export type DataFetcher<T> = (params: DataFetcherParams<T>) => FetchResult<T>

export interface TableProps<T extends AnyObject, C extends readonly ColumnType<T>[]>
	extends Omit<AntdTableProps, 'dataSource' | 'columns' | 'onChange'> {
	tableId: string
	/** Either static data or a promise that returns the desired data */
	dataSource: DataSource<T>
	/**
	 * Allows you to customize how your table component fetches and manages data,
	 * enabling integration with any data fetching library or approach.
	 */
	dataFetcher?: DataFetcher<T>
	columns: C
	/** Initial filters values. You should set only the values for the fields that are filterable. */
	defaultFilters: Filters<keyof T, null>
	/** Variables that should trigger a refetch */
	refetchTriggers?: unknown[]
	/** Displays a reset filters button */
	displayResetFilters?: true
	/** Table header render callback */
	renderHeader?: RenderHeaderCallback
	/** Disabled by default. Configuring the global search enables it automatically. Default debounce delay = 750ms */
	globalSearchConfig?: {
		searchedFields: Array<ExtractTitles<C>>
		/**
		 * In milliseconds. Set this to 0 to have no filter delay.
		 * @default 750
		 */
		debounceDelay?: number
	}
}

export type StaticDataSource<T> = Array<T>

export type DataSource<T> =
	| StaticDataSource<T>
	| ((params: DataFetcherParams<T>) => Promise<{ data: StaticDataSource<T>; totalCount: number }>)

export type ColumnType<T extends AnyObject> = Omit<TableColumnType<T>, 'title'> & {
	title: string
}

export type ColumnFilterType<T extends AnyObject> = Pick<
	ColumnType<T>,
	'filterDropdown' | 'filterIcon' | 'onFilterDropdownOpenChange'
>

export type ColumnStaticFilterType<T extends AnyObject> = Pick<
	ColumnType<T>,
	'filterDropdown' | 'filterIcon' | 'onFilterDropdownOpenChange' | 'onFilter'
>

export interface RenderTableHeaderParams<T extends AnyObject, C extends readonly ColumnType<T>[]> {
	resetFilters: {
		enabled: boolean
		onClick: () => void
	}
	globalSearch: {
		enabled: boolean
		searchedFields: Array<ExtractTitles<C>>
		value: string
		setValue: (value: string) => void
	}
	renderCallback: (
		globalSearchNode: React.ReactNode,
		resetFiltersNode: React.ReactNode,
	) => React.ReactNode
}

type RenderHeaderCallback = (
	resetFiltersButton?: ReactNode,
	globalSearchInput?: ReactNode,
) => ReactNode

//eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractTitles<C extends readonly ColumnType<any>[]> = Extract<C[number]['title'], string>

/* - - - Table config - - - */

/**
 * WARNING: All properties in tableConfig are persisted to localStorage.
 * Be mindful when adding new properties as they will increase storage usage
 * and will persist after full page reload.
 */
export interface TableConfigState<T> {
	filters: Filters<keyof T> | undefined
	sorter: Sorter<T> | undefined
	pagination: Pagination | undefined
}

export type Filters<K extends string | number | symbol, V = FilterValue> = Partial<Record<K, V>>

type FilterValue = AntdFilterValue | null | undefined

interface Sorter<T> {
	field: keyof T
	order: SortOrder
}

interface Pagination {
	size: number
}
