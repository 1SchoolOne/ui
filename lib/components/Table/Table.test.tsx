import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, expect, test } from 'vitest'

import { ThemeProvider } from '../ThemeProvider/ThemeProvider'
import { Table } from './Table'

const data = Array.from({ length: 10 }).map((_, index) => ({
	id: index,
	name: `dummy user ${index}`,
	description: `dummy description ${index}`,
}))

describe('Table', () => {
	test('displays an error in the table body if fetching fails', async () => {
		const { findByText, getByText } = render(
			<ThemeProvider>
				<Table
					tableId="dummy-table"
					dataSource={async () => {
						throw 'Test dummy error'

						return { totalCount: data.length, data }
					}}
					columns={[
						{ title: 'ID', dataIndex: 'id' },
						{ title: 'Name', dataIndex: 'name' },
						{ title: 'Description', dataIndex: 'description' },
					]}
					defaultFilters={{}}
				/>
			</ThemeProvider>,
		)

		expect(
			await findByText(
				'Une erreur est survenue lors du chargement des données. Veuillez réessayer.',
			),
		).toBeTruthy()

		await userEvent.click(getByText('Détails'))

		expect(getByText('Test dummy error')).toBeTruthy()
	})
})
