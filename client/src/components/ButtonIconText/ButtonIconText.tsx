import React from 'react'
import { IButtonIconText } from './ButtonIconText.props'
import './ButtonIconText.css'

export const ButtonIconText = ({ text, children, onClick }: IButtonIconText) => {
	return (
		<button className='btn add_btn' onClick={onClick}>
			<span className='add_btn-icon'>
				{ children }
			</span>
			<span>{text}</span>
		</button>
	)
}
