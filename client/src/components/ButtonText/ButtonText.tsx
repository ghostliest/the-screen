import React from 'react'
import { IButtonText } from './IButtonText.props'
import './ButtonText.css'

export const ButtonText = ({ type, placeholder, onClick, className = '', ...props }: IButtonText) => {
	const classAssociatedWithType = {
		PRIMARY: 'btn-primary',
		SECONDARY: 'btn-secondary',
		TRANSPARENT: 'btn-transparent',
		INACTIVE: 'btn-inactive tooltip'
	}

	return (
		<button
			className={`btn btn-text ${classAssociatedWithType[type]} ${className}`}
			onClick={onClick}
			{ ...props }
		>
			{
				<>
					{placeholder}
					{type === 'INACTIVE' && <span className="tooltiptext">Currently unavailable</span>}
				</>
			}
		</button>
	)
}
