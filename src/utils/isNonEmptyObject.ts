/** Helper function to check if the given parameter is a non empty object. */
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isNonEmptyObject(obj: any): obj is object {
	return typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0
}
