import React from 'react'
import { Admin, Auth, Content, Person, Home, FoldersMain, Folder } from 'pages'
import {
	ADMIN_ROUTE,
	HOME_ROUTE,
	FILM_ROUTE,
	LOGIN_ROUTE,
	REGISTRATION_ROUTE,
	PERSON_ROUTE,
	FOLDERS_ROUTE
} from 'utils/consts'

interface Routes {
	path: string;
	Component: () => React.ReactElement
}

export const adminRoutes: Routes[] = [
	{	path: ADMIN_ROUTE, Component: Admin }
]

export const privateRoutes: Routes[] = [
	{ path: FOLDERS_ROUTE, Component: FoldersMain },
	{ path: FOLDERS_ROUTE + '/:type', Component: Folder }
]

export const publicRoutes: Routes[] = [
	{ path: HOME_ROUTE, Component: Home },
	{ path: LOGIN_ROUTE, Component: Auth },
	{	path: REGISTRATION_ROUTE,	Component: Auth },
	{	path: FILM_ROUTE + '/:id', Component: Content	},
	{ path: PERSON_ROUTE + '/:id', Component: Person }
]
