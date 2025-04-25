import { QueryKey } from '@tanstack/react-query'
import { TableProps as AntdTableProps, TableColumnType } from 'antd'
import { ReactNode } from 'react'

import { NonUndefined } from '@types'

export type FilterValue = TableColumnType['filteredValue']

export type SortOrder = NonUndefined<TableColumnType['sortOrder']>

export type AnyObject = {
	[x: string]: any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface TableProps<T extends AnyObject, C extends readonly ColumnType<T>[]>
	extends Omit<AntdTableProps, 'dataSource' | 'columns' | 'onChange'> {
	tableId: string
	/** Either static data or a promise that returns the desired data */
	dataSource: DataSource<T>
	columns: C
	/** Initial filters values. You should set only the values for the fields that are filterable. */
	defaultFilters: Filters<keyof T, null>
	/** Variables that should trigger a refetch */
	refetchTriggers?: QueryKey
	/** Displays a reset filters button */
	displayResetFilters?: true
	/** Table header render callback */
	renderHeader?: RenderHeaderCallback
	/** Disabled by default. Configuring the global search enables it automatically. Default debounce delay = 750ms */
	globalSearchConfig?: {
		searchedFields: Array<ExtractTitles<C>>
		/**
		 * In milliseconds
		 * @default 750
		 */
		debounceDelay?: number
	}
}

type DataSourceObject<T> = { totalCount: number; data: T }

type DataSource<T> =
	| DataSourceObject<Array<T>>
	| ((
			filters: Filters<keyof T> | undefined,
			sorter: Sorter<T> | undefined,
			pagination: Pagination | undefined,
			currentPage: number,
	  ) => Promise<DataSourceObject<Array<T>>>)

export type ColumnType<T extends AnyObject> = Omit<TableColumnType<T>, 'dataIndex' | 'title'> & {
	dataIndex: Extract<keyof T, string>
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

export type ColumnsType<T extends AnyObject> = Array<ColumnType<T>>

export interface RenderHeaderParams {
	resetFiltersButton: ReactNode
	globalSearchInput: ReactNode
	showHeader: boolean
	renderCallback: RenderHeaderCallback
}

type RenderHeaderCallback = (
	resetFiltersButton?: ReactNode,
	globalSearchInput?: ReactNode,
) => ReactNode

//eslint-disable-next-line @typescript-eslint/no-explicit-any
type ExtractTitles<C extends readonly ColumnType<any>[]> = Extract<C[number]['title'], string>

/* - - - Table config - - - */

export interface TableConfigState<T> {
	filters: Filters<keyof T> | undefined
	sorter: Sorter<T> | undefined
	pagination: Pagination | undefined
}

export type Filters<K extends string | number | symbol, V = FilterValue> = Partial<Record<K, V>>

export interface Sorter<T> {
	field: keyof T
	order: SortOrder
}

export interface Pagination {
	size: number
}

/* - - - Utils - - - */

export interface UseGlobalSearchParams<T extends AnyObject, C extends readonly ColumnType<T>[]> {
	searchedFields: Array<ExtractTitles<C>>
	debounceDelay?: number
}
