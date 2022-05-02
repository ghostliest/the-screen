export interface ISelectDropdown {
	currentId: number,
	menuValues: Array<{ id: number, placeholder?: string, value: string }>,
	setMenuValues?: any,
	border?: 'DEFAULT' | 'PRIMARY'
}
