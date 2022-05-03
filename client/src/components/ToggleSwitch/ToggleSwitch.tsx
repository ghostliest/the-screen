import React, { useState } from 'react'
import { IToggleSwitch } from './ToggleSwitch.props'
import './ToggleSwitch.css'

export const ToggleSwitch = ({ values, setValue, initialPos = 0 }: IToggleSwitch) => {
	const [pos, setPos] = useState(initialPos)

	const handleItemClick = (id: number) => {
		if (id !== pos) {
			setPos(id)
			setValue(id)
		}
	}

	return (
		<div className="toggle_switch-container">
			<div className="toggle_switch-wrapper">
				<div className="toggle_switch-content">
					{
						values.map(({ id, placeholder, value }) => (
							<div
								key={id}
								className={`toggle_switch-item ${id === pos ? 'toggle_switch-item-select' : 'toggle_switch-item-not-select'}`}
								onClick={() => handleItemClick(id)}>
								{placeholder || value}
							</div>
						))
					}
				</div>
				<div
					className="toggle_switch-btn"
					style={{ width: `${Math.floor(100 / values.length)}%`, transform: `translateX(${pos * 100}%)` }}>
				</div>
			</div>
		</div>
	)
}
