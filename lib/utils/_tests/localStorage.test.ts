import { describe } from 'node:test'
import { beforeEach, expect, test } from 'vitest'

import { getLocalStorage } from '../localStorage'

const localStorage = getLocalStorage()

// Tests only the overriden methods
describe('getLocalStorage', () => {
	beforeEach(() => localStorage.clearAll())

	test('sets and gets an item successfully', () => {
		localStorage.set('testKey', 'testValue')

		expect(localStorage.get('testKey')).toEqual('testValue')
	})

	test('checks presence successfully', () => {
		localStorage.set('testKey', 'hello world')

		expect(localStorage.has('testKey')).toBeTruthy()
		expect(localStorage.has('falsyKey')).toBeFalsy()
	})

	test('sets and gets all items successfully', () => {
		const testData = { key1: 'value1', key2: 'value2', key3: 'value3' }

		localStorage.setAll(testData)

		expect(localStorage.getAll()).toEqual(testData)
	})

	test('removes an item successfully', () => {
		localStorage.set('testKey', 'remove me please')

		localStorage.remove('testKey')

		expect(localStorage.get('testKey')).toBeNull()
		expect(localStorage.has('testKey')).toBeFalsy()
	})
})
