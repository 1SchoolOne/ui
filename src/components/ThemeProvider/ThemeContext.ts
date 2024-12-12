import { createContext } from "react"

export type ThemeMode = 'light' | 'dark'
export type ThemePreference = ThemeMode | 'system'

export interface ThemeContextState {
	themePreference: ThemePreference
	activeTheme: ThemeMode
	setThemePreference: (theme: ThemePreference) => void
}

export const ThemeContext = createContext<ThemeContextState>(null!)