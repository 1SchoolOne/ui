import { getLocalStorage } from '@utils/localStorage'

export const SIDEBAR_STORAGE_KEY = 'sidebar.isCollapsed'

export function loadStorage(defaultCollapsed: boolean): boolean {
	const storage = getLocalStorage()
	const isCollapsedStorage = storage.get(SIDEBAR_STORAGE_KEY)

	// Is the key already initialized ?
	if (isCollapsedStorage !== null && isCollapsedStorage !== undefined) {
		return isCollapsedStorage
	}

	// If not, set the key to the default value and return it
	storage.set({ key: SIDEBAR_STORAGE_KEY, data: defaultCollapsed })

	return defaultCollapsed
}
