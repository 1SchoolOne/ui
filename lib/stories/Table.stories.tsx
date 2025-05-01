import type { Meta, StoryObj } from '@storybook/react'

import { Table } from '@lib/components/Table/Table'
import { ColumnType } from '@lib/components/Table/Table-types'
import { getSearchFilterConfig } from '@lib/components/Table/Table-utils'

const meta: Meta<typeof Table> = {
	title: 'Components/Table',
	component: Table,
	tags: ['autodocs'],
}

export default meta

type DataType = { id: number; userId: number; title: string; body: string }

const columns: ColumnType<DataType>[] = [
	{ dataIndex: 'id', title: 'ID' },
	{ dataIndex: 'userId', title: 'User ID', ...getSearchFilterConfig({ current: null }) },
	{ dataIndex: 'title', title: 'Title', ...getSearchFilterConfig({ current: null }) },
	{ dataIndex: 'body', title: 'Body', ...getSearchFilterConfig({ current: null }) },
] as const

export const Example: StoryObj<typeof Table<DataType>> = {
	args: {
		tableId: 'example',
		displayResetFilters: true,
		showHeader: true,
		columns,
		dataSource: async ({ filters, sorter, pagination, currentPage, globalSearch }) => {
			const urlParams = new URLSearchParams()

			// Pagination
			urlParams.append('_page', String(currentPage))
			urlParams.append('_limit', String(pagination?.size))

			// Global search and filters
			if (globalSearch) {
				urlParams.append('q', globalSearch)
			} else {
				if (filters?.userId) {
					urlParams.append('userId', String(filters.userId))
				}

				if (filters?.title) {
					urlParams.append('title_like', String(filters.title))
				}

				if (filters?.body) {
					urlParams.append('body_like', String(filters.body))
				}
			}

			// Sorter
			urlParams.append('sort', sorter ? sorter.field : 'id')

			const res = await fetch(`https://jsonplaceholder.typicode.com/posts/?${urlParams.toString()}`)
			const totalCount = Number(res.headers.get('x-total-count'))
			const data = (await res.json()) as Array<{
				id: number
				userId: number
				title: string
				body: string
			}>

			// The total count should be the total number of records without any filters
			return { totalCount, data }
		},
		defaultFilters: {
			id: null,
			userId: null,
			title: null,
			body: null,
		},
		globalSearchConfig: {
			searchedFields: ['User ID', 'Title', 'Body'],
		},
	},
}
