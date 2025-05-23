import { getLocalStorage } from '@lib/utils/localStorage'

export const SIDEBAR_STORAGE_KEY = 'sidebar.isCollapsed'

export function loadStorage(defaultCollapsed: boolean): boolean {
	const storage = getLocalStorage<{ [SIDEBAR_STORAGE_KEY]: boolean }>()
	const isCollapsedStorage = storage.get(SIDEBAR_STORAGE_KEY)

	// Is the key already initialized ?
	if (isCollapsedStorage !== null && isCollapsedStorage !== undefined) {
		return isCollapsedStorage
	}

	// If not, set the key to the default value and return it
	storage.set(SIDEBAR_STORAGE_KEY, defaultCollapsed)

	return defaultCollapsed
}
