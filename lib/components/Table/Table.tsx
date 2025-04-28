import { useQuery } from '@tanstack/react-query'
import { Table as AntdTable, Grid } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { TableRef } from 'antd/es/table'
import classNames from 'classnames'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'

import { ThemeContext } from '@lib/components/ThemeProvider/ThemeContext'

import { useLocalStorage } from '@lib/utils/localStorage'

import { DEFAULT_PAGE_SIZE_OPTIONS } from './Table-constants'
import { ColumnType, ColumnsType, Filters, TableConfigState, TableProps } from './Table-types'
import {
	defaultRenderHeaderCallback,
	generateRowKey,
	getRowClassname,
	loadStorage,
	useGlobalSearch,
	useTableHeader,
	useTableHeight,
} from './Table-utils'
import { ResetFiltersButton } from './_components/ResetFiltersButton/ResetFiltersButton'

import './Table-styles.less'

const { useBreakpoint } = Grid

export function Table<T extends AnyObject, C extends readonly ColumnType<T>[]>(
	props: TableProps<T, C>,
) {
	const {
		tableId,
		columns,
		dataSource,
		defaultFilters,
		className,
		refetchTriggers = [],
		pagination,
		locale,
		displayResetFilters,
		showHeader,
		renderHeader = defaultRenderHeaderCallback,
		globalSearchConfig,
		...restProps
	} = props

	const storage = useLocalStorage()
	const { activeTheme } = useContext(ThemeContext)
	const screens = useBreakpoint()
	const tableRef = useRef<TableRef>(null)
	const { globalSearchInput, globalSearchValue } = useGlobalSearch<T, C>({
		...globalSearchConfig,
		searchedFields: globalSearchConfig?.searchedFields ?? [],
	})
	const [currentPage, setCurrentPage] = useState(1)
	const [tableConfig, setTableConfig] = useState<TableConfigState<T>>(
		loadStorage<T>(tableId, defaultFilters),
	)
	const tableHeight = useTableHeight(tableRef, !!displayResetFilters)
	const tableHeader = useTableHeader({
		resetFiltersButton: displayResetFilters ? (
			<ResetFiltersButton
				onClick={() => {
					setTableConfig((prev) => ({ ...prev, filters: defaultFilters }))
				}}
			/>
		) : null,
		globalSearchInput,
		showHeader: showHeader ?? false,
		renderCallback: renderHeader,
	})

	const { data: tableData, isPending } = useQuery({
		queryKey: [
			`${tableId}.table`,
			{
				filters: tableConfig.filters,
				sorter: tableConfig.sorter,
				pagination: { ...tableConfig.pagination, currentPage },
				globalSearch: globalSearchValue,
			},
			...refetchTriggers,
		],
		queryFn: async () => {
			if (typeof dataSource !== 'function') {
				return dataSource
			}

			return await dataSource(
				tableConfig.filters,
				tableConfig.sorter,
				tableConfig.pagination,
				currentPage,
			)
		},
	})

	const cols: ColumnsType<T> = useMemo(
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
			{tableHeader}
			<AntdTable
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
				}}
				dataSource={tableData?.data ?? []}
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
				loading={isPending}
				pagination={
					pagination === false
						? false
						: {
								pageSize: tableConfig.pagination?.size,
								pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
								total: tableData?.totalCount,
								showTotal: pagination?.showTotal
									? pagination.showTotal
									: (total, range) => `${range[0]}-${range[1]} sur ${total}`,
								locale: {
									next_page: 'Page suivante',
									prev_page: 'Page précédente',
								},
								...pagination,
							}
				}
				locale={{
					emptyText: 'Aucune donnée',
					filterConfirm: 'OK',
					filterReset: 'Réinitialiser',
					filterTitle: 'Filtres',
					selectAll: 'Tout sélectionner',
					selectInvert: 'Inverser la sélection',
					sortTitle: 'Trier',
					triggerAsc: 'Ordre croissant',
					triggerDesc: 'Ordre décroissant',
					cancelSort: 'Réinitialiser le tri',
					...locale,
				}}
			/>
		</>
	)
}
