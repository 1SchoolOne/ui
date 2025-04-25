import { ConfigProvider, theme as themeAlg } from 'antd'
import frenchLocale from 'antd/locale/fr_FR'
import { useEffect, useState } from 'react'

import { PropsWithChildren } from '~/types'

import { useLocalStorage } from '~/utils/localStorage'

import { ThemeContext, ThemeContextState, ThemeMode, ThemePreference } from './ThemeContext'

export function ThemeProvider({ children }: PropsWithChildren) {
	const storage = useLocalStorage<{ theme: ThemePreference }>()

	const getInitialThemePreference = (): ThemePreference => {
		return storage.get('theme') ?? 'system'
	}

	const [themePreference, setThemePreference] = useState<ThemePreference>(getInitialThemePreference)
	const [systemTheme, setSystemTheme] = useState<ThemeMode>(() => {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark'
		}
		return 'light'
	})

	const activeTheme: ThemeMode = themePreference === 'system' ? systemTheme : themePreference

	useEffect(function listenForSystemChange() {
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

		const handleChange = (e: MediaQueryListEvent) => {
			setSystemTheme(e.matches ? 'dark' : 'light')
		}

		mediaQuery.addEventListener('change', handleChange)

		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [])

	useEffect(() => {
		storage.set('theme', themePreference)
	}, [themePreference, storage])

	const value: ThemeContextState = {
		themePreference,
		activeTheme,
		setThemePreference,
	}

	return (
		<ThemeContext.Provider value={value}>
			<ConfigProvider
				theme={{
					cssVar: true,
					token: { colorPrimary: '#FE8E06' },
					algorithm: activeTheme === 'dark' ? themeAlg.darkAlgorithm : themeAlg.defaultAlgorithm,
				}}
				locale={frenchLocale}
			>
				{children}
			</ConfigProvider>
		</ThemeContext.Provider>
	)
}
