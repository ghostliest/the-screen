import React from 'react'

export interface IButtonText extends React.HTMLAttributes<HTMLButtonElement> {
	type: 'PRIMARY' | 'SECONDARY' | 'TRANSPARENT' | 'INACTIVE',
	placeholder: string,
	className?: string
	onClick: React.MouseEventHandler<HTMLButtonElement>
}
