import { ReactNode } from 'react'
export interface IButtonIconText {
	text: string,
	children: ReactNode,
	transparent?: boolean
	onClick: () => void
}
