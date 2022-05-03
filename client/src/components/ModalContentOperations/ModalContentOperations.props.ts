import React from 'react'

export interface IModalContentOperations {
	isVisibleModal: boolean,
	setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>,
	mode: 'CREATE' | 'UPDATE'
}

export interface IModalContentScreen {
	editContentId: any,
	setVisibleModal: React.Dispatch<React.SetStateAction<boolean>>,
	isLoading: boolean,
	setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
	mode: 'CREATE' | 'UPDATE'
}

export interface IMetaInfo {
	view: { id: number, value: string }[],
	initial: number[],
	to: { add: number[], delete: number[] }
}

export interface IContentInfo<T> {
	initial: T;
	to: T;
}

export interface ICustomInput {
	className: string,
	type: React.HTMLInputTypeAttribute
	placeholder: string,
	value: IContentInfo<any> | IMetaInfo,
	onChange: any,
	inputType?: 'input' | 'textarea'
}
