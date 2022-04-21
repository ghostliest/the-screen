import React, { ReactNode } from 'react'
import { Header } from '..'
import { useTypeSelector } from '../../hooks'
import './Layout.css'

export const Layout = ({ children }: { children: ReactNode }) => {
	const { height } = useTypeSelector(state => state.componentsInfo.header)

	return (
		<div className='layout' style={{ minHeight: `calc(100vh - ${height}px)` }}>
			<Header />
			<main className='layout-main'>{children}</main>
		</div>
	)
}
