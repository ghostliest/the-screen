export const timeFormat = (value: number, withHour: boolean) => {
	return withHour ? `${Math.floor(value / 60)}h ${value % 60}m` : `${value}m`
}
