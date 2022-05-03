import React from 'react'

export interface IToggleSwitch {
	values: Array<{ id: number, placeholder?: string, value: any }>,
	setValue: React.Dispatch<React.SetStateAction<any>>,
	initialPos?: number
}
