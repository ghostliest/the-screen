import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { useTypeSelector } from '../hooks'
import { Error404 } from '../pages'
import { publicRoutes, privateRoutes, adminRoutes } from '../routes'
import { Layout } from './Layout/Layout'

const AppRouter = () => {
	const { isAdmin, isAuth } = useTypeSelector(state => state.user)

	return (
		<Layout>
			<Routes>
				{
					isAdmin && adminRoutes.map(({ path, Component }) => (
						<Route key={path} path={path} element={<Component />} />
					))
				}
				{
					isAuth && privateRoutes.map(({ path, Component }) => (
						<Route key={path} path={path} element={<Component />} />
					))
				}
				{
					publicRoutes.map(({ path, Component }) => (
						<Route key={path} path={path} element={<Component />} />
					))
				}
				<Route path="*" element={<Error404 />} />
			</Routes>
		</Layout>
	)
}

export default AppRouter
