import React from 'react'

export interface IButtonText extends React.HTMLAttributes<HTMLButtonElement> {
	type: 'PRIMARY' | 'SECONDARY',
	placeholder: string,
	className?: string
	onClick: React.MouseEventHandler<HTMLButtonElement>
}
