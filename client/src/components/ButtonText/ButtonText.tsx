import React from 'react'
import { IButtonText } from './IButtonText.props'
import './ButtonText.css'

export const ButtonText = ({ type, placeholder, onClick, className = '', ...props }: IButtonText) => {
	return (
		<button
			className={`btn btn-text ${type === 'PRIMARY' ? 'btn-primary' : 'btn-secondary'} ${className}`}
			onClick={onClick}
			{ ...props }
		>
			{placeholder}
		</button>
	)
}
