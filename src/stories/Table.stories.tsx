import type { Meta, StoryObj } from '@storybook/react'

import { Table } from '@components'

import { getSearchFilterConfig } from '../components/Table/Table-utils'

const meta: Meta<typeof Table> = {
	title: 'Components/Table',
	component: Table,
	tags: ['autodocs'],
}

export default meta

const columns = [
	{ dataIndex: 'id', title: 'ID' },
	{ dataIndex: 'userId', title: 'User ID', ...getSearchFilterConfig({ current: null }) },
	{ dataIndex: 'title', title: 'Title', ...getSearchFilterConfig({ current: null }) },
	{ dataIndex: 'body', title: 'Body', ...getSearchFilterConfig({ current: null }) },
] as const

export const Example: StoryObj<
	typeof Table<{ id: number; userId: number; title: string; body: string }, typeof columns>
> = {
	args: {
		tableId: 'example',
		displayResetFilters: true,
		showHeader: true,
		columns,
		dataSource: async (filters, sorter, pagination, currentPage) => {
			const filterQuery = `${filters?.id ? '&id=' + filters.id : ''}${filters?.userId ? '&userId=' + filters.userId : ''}${filters?.title ? '&title_like=' + filters.title : ''}${filters?.body ? '&body_like=' + filters.body : ''}`
			const sorterQuery = sorter ? '&_sort=' + sorter.field : '&_sort=id'
			const query = `?_page=${currentPage}&_limit=${pagination?.size}${sorterQuery}${filterQuery}`
			const res = await fetch(`https://jsonplaceholder.typicode.com/posts${query}`)
			const data = (await res.json()) as Array<{
				id: number
				userId: number
				title: string
				body: string
			}>

			// The total count should be the total number of records without any filters
			return { totalCount: 100, data }
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
