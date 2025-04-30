import { ReactNode } from 'react'

export type PropsWithChildren<P = object> = P & { children: ReactNode }

export interface LocalStorageData {
	[k: string]: unknown
}

export type AnyObject = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[x: string]: any
}
