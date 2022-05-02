import React from 'react'

export interface IModal {
	children: React.ReactNode,
	isVisibleModal: boolean,
	setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>,
}
