import { Table as AntdTable, Grid } from 'antd'
import { TableRef } from 'antd/es/table'
import classNames from 'classnames'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { ThemeContext } from '@lib/components/ThemeProvider/ThemeContext'

import { AnyObject } from '@lib/types'

import { useLocalStorage } from '@lib/utils/localStorage'
import { useDebounce } from '@lib/utils/useDebounce'

import { DEFAULT_GLOBAL_SEARCH_DEBOUNCE, DEFAULT_PAGE_SIZE_OPTIONS } from './Table-constants'
import { ColumnType, DataFetcherParams, Filters, TableConfigState, TableProps } from './Table-types'
import {
	generateRowKey,
	getRowClassname,
	getScrollX,
	loadStorage,
	renderTableHeader,
	useConditionalDataFetcher,
	useTableHeight,
} from './Table-utils'
import { TableError } from './_components/TableError/TableError'

import './Table-styles.less'

const { useBreakpoint } = Grid

export function Table<T extends AnyObject, C extends readonly ColumnType<T>[] = ColumnType<T>[]>(
	props: TableProps<T, C>,
) {
	const {
		className,
		columns,
		dataFetcher,
		dataSource,
		defaultFilters,
		displayResetFilters,
		globalSearchConfig,
		locale,
		pagination,
		refetchTriggers,
		renderHeader,
		showHeader,
		tableId,
		...restProps
	} = props

	const storage = useLocalStorage()
	const { activeTheme } = useContext(ThemeContext)
	const screens = useBreakpoint()
	const tableRef = useRef<TableRef>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [gblSearchValue, setGblSearchValue] = useState('')
	const debounceGblSearch = useDebounce(
		gblSearchValue,
		globalSearchConfig?.debounceDelay ?? DEFAULT_GLOBAL_SEARCH_DEBOUNCE,
	)
	/**
	 * WARNING: All properties in tableConfig are persisted to localStorage.
	 * Be mindful when adding new properties as they will increase storage usage
	 * and will persist after full page reload.
	 */
	const [tableConfig, setTableConfig] = useState<TableConfigState<T>>(
		loadStorage<T>(tableId, defaultFilters),
	)
	const tableHeight = useTableHeight(tableRef, !!displayResetFilters)

	const fetchParams: DataFetcherParams<T> = {
		filters: tableConfig.filters,
		sorter: tableConfig.sorter,
		pagination: tableConfig.pagination,
		currentPage,
		globalSearch: debounceGblSearch,
		refetchTriggers,
	}

	const fetchResult = useConditionalDataFetcher({
		tableId,
		dataSource,
		fetchParams,
		customDataFetcher: dataFetcher,
	})

	const { data, error, isLoading, refetch, totalCount } = fetchResult

	const cols: ColumnType<T>[] = useMemo(
		() =>
			columns.map((col) => ({
				...col,
				width: col.width ?? 200,
				filteredValue: tableConfig.filters?.[col.dataIndex as string],
				sortOrder:
					tableConfig?.sorter?.field === col.dataIndex ? tableConfig?.sorter?.order : undefined,
			})),
		[columns, tableConfig.filters, tableConfig.sorter],
	)

	useEffect(
		function syncTableConfig() {
			storage.set(`${tableId}.table`, tableConfig)
		},
		[storage, tableConfig, tableId],
	)

	return (
		<>
			{showHeader &&
				renderTableHeader({
					globalSearch: {
						enabled: !!globalSearchConfig,
						searchedFields: globalSearchConfig?.searchedFields ?? [],
						setValue: setGblSearchValue,
						value: gblSearchValue,
					},
					resetFilters: {
						enabled: !!displayResetFilters,
						onClick: () => setTableConfig((prev) => ({ ...prev, filters: defaultFilters })),
					},
					renderCallback: renderHeader
						? renderHeader
						: (globalSearchNode, resetFiltersNode) => (
								<>
									{globalSearchNode}
									{resetFiltersNode}
								</>
							),
				})}
			<AntdTable<T>
				{...restProps}
				ref={tableRef}
				className={classNames('schoolone-table', className)}
				rowClassName={(_record, index) => getRowClassname(index, activeTheme)}
				rowKey={(record) => {
					const rowKey = generateRowKey(JSON.stringify(record))

					return `${tableId}-${rowKey}`
				}}
				size={screens.xxl ? 'large' : 'small'}
				scroll={{
					y: tableHeight,
					x: getScrollX(tableRef),
				}}
				dataSource={error ? [] : (data ?? [])}
				columns={cols}
				onChange={(pagination, filters, sorter) => {
					if (!Array.isArray(sorter)) {
						const sorterObject = sorter.order
							? { field: sorter.field as keyof T, order: sorter.order }
							: undefined

						const paginationObject =
							pagination.current && pagination.pageSize ? { size: pagination.pageSize } : undefined

						setCurrentPage(pagination.current ?? 1)
						setTableConfig((prevConfig) => ({
							...prevConfig,
							filters: filters as Filters<keyof T>,
							sorter: sorterObject,
							pagination: paginationObject,
						}))
					}
				}}
				loading={isLoading}
				pagination={
					pagination !== false
						? {
								pageSize: tableConfig.pagination?.size,
								pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
								total: totalCount,
								showTotal: (total, [startRange, endRange]) =>
									`${startRange}-${endRange} sur ${total}`,
								...pagination,
							}
						: false
				}
				locale={{
					emptyText: error ? (
						<TableError errorMessage={error.message} refetch={refetch} />
					) : undefined,
					...locale,
				}}
			/>
		</>
	)
}
