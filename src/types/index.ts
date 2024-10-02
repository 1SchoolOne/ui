import { ReactNode } from 'react'

export type PropsWithChildren<P = object> = P & { children: ReactNode }

export interface LocalStorageData {
	[k: string]: unknown
}
