import { useMemo } from 'react'
import store2, { StoredData } from 'store2'

let storage = store2

interface SetStorageParams<T extends StoredData, K extends keyof T> {
	key: K
	data: T[K]
}

export function useLocalStorage<T extends StoredData>(prefix?: string | false) {
	const localStorage = useMemo(() => getLocalStorage<T>(prefix), [prefix])

	return localStorage
}

export function getLocalStorage<T extends StoredData>(prefix?: string | false) {
	if (prefix !== false) {
		storage = store2.namespace(prefix ?? 'sch-one')
	}

	const set = <K extends keyof T>(params: SetStorageParams<T, K>) => {
		storage.set(params.key, params.data)
	}

	const get = <K extends keyof T>(key: K): T[K] | null => storage.get(key)

	const has = <K extends keyof T>(key: K): boolean => storage.has(key)

	const getAll = (): Partial<T> => storage.getAll() as Partial<T>

	const setAll = (data: Partial<T>) => storage.setAll(data)

	const remove = <K extends keyof T>(key: K): T[K] => storage.remove(key)

	return {
		...storage,
		set,
		get,
		has,
		getAll,
		setAll,
		remove,
	}
}
