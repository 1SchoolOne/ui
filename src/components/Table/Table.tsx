import { useQuery } from '@tanstack/react-query'
import { Table as AntdTable } from 'antd'
import { AnyObject } from 'antd/es/_util/type'
import { TableRef } from 'antd/es/table'
import classNames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'

import { useTheme } from '@components'
import { useLocalStorage } from '@utils/localStorage'

import { Filters, TableConfigState, TableProps } from './Table-types'
import { generateRowKey, getRowClassname, loadStorage } from './Table-utils'

import './Table-styles.less'

export function Table<T extends AnyObject>(props: TableProps<T>) {
	const { tableId, columns, dataSource, defaultFilters, className, ...restProps } = props

	const storage = useLocalStorage()
	const { theme } = useTheme()
	const tableRef = useRef<TableRef>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [tableConfig, setTableConfig] = useState<TableConfigState<T>>(
		loadStorage<T>(tableId, defaultFilters),
	)

	const { data: tableData, isPending } = useQuery({
		queryKey: [`${tableId}.table`, currentPage, tableConfig.filters, tableConfig.pagination],
		queryFn: async () => {
			if (typeof dataSource !== 'function') {
				return dataSource
			}

			return await dataSource(
				tableConfig.filters,
				tableConfig.sorter,
				tableConfig.pagination,
				currentPage,
				//globalSearchValue,
			)
		},
	})

	const cols: typeof columns = useMemo(
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
			storage.set({ key: `${tableId}.table`, data: tableConfig })
		},
		[storage, tableConfig, tableId],
	)

	return (
		<AntdTable
			{...restProps}
			ref={tableRef}
			className={classNames('schoolone-table', className)}
			rowClassName={(_record, index) => getRowClassname(index, theme)}
			rowKey={(record) => {
				const rowKey = generateRowKey(JSON.stringify(record))

				return `${tableId}-${rowKey}`
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
			pagination={{
				pageSize: tableConfig.pagination?.size,
				pageSizeOptions: [25, 50, 75, 100],
				total: tableData?.totalCount,
			}}
		/>
	)
}
