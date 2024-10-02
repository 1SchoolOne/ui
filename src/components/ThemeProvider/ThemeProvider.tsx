import { ConfigProvider, theme as themeAlg } from 'antd'
import frenchLocale from 'antd/locale/fr_FR'
import { createContext, useContext, useState } from 'react'

import { PropsWithChildren } from '@types'

interface ThemeContextState {
	theme: 'light' | 'dark'
	toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextState>(null!)

export function ThemeProvider({ children }: PropsWithChildren) {
	const [theme, setTheme] = useState<'light' | 'dark'>('light')

	const toggleTheme = () => {
		setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
	}

	const value: ThemeContextState = {
		theme,
		toggleTheme,
	}

	return (
		<ThemeContext.Provider value={value}>
			<ConfigProvider
				theme={{
					cssVar: true,
					token: { colorPrimary: '#FE8E06' },
					algorithm: theme === 'dark' ? themeAlg.darkAlgorithm : themeAlg.defaultAlgorithm,
				}}
				locale={frenchLocale}
			>
				{children}
			</ConfigProvider>
		</ThemeContext.Provider>
	)
}

export function useTheme() {
	return useContext(ThemeContext)
}
