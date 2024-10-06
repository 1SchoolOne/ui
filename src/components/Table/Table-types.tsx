import { QueryKey } from '@tanstack/react-query'
import { TableProps as AntdTableProps } from 'antd'
import { TableColumnType } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { FilterValue as AntdFilterValue, SortOrder } from 'antd/es/table/interface'
import { ReactNode } from 'react'

export interface TableProps<T extends AnyObject>
	extends Omit<AntdTableProps, 'dataSource' | 'columns' | 'onChange'> {
	tableId: string
	/** Either static data or a promise that returns the desired data */
	dataSource: DataSource<T>
	columns: ColumnsType<T>
	/** Initial filters values */
	defaultFilters: Filters<keyof T, null>
	/** Variables that should trigger a refetch */
	refetchTriggers?: QueryKey
	/** Displays a reset filters button */
	displayResetFilters?: true
	/** Table header render callback */
	renderHeader?: RenderHeaderCallback
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

export type ColumnType<T extends AnyObject> = Omit<TableColumnType<T>, 'dataIndex'> & {
	dataIndex: Extract<keyof T, string>
}

export type ColumnsType<T extends AnyObject> = Array<ColumnType<T>>

export interface RenderHeaderParams {
	resetFiltersButton: JSX.Element | null
	showHeader: boolean
	renderCallback: RenderHeaderCallback
}

type RenderHeaderCallback = (resetFiltersButton?: ReactNode) => ReactNode

/* - - - Table config - - - */

export interface TableConfigState<T> {
	filters: Filters<keyof T> | undefined
	sorter: Sorter<T> | undefined
	pagination: Pagination | undefined
}

export type Filters<K extends string | number | symbol, V = FilterValue> = Partial<Record<K, V>>

export type FilterValue = AntdFilterValue | null | undefined

export interface Sorter<T> {
	field: keyof T
	order: SortOrder
}

export interface Pagination {
	size: number
}
