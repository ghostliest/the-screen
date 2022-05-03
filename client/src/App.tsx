import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import JwtDecode from 'jwt-decode'
import { checkAuth } from './API/userApi'
import AppRouter from './components/AppRouter'
import { setUser, setIsAuth, setIsAdmin } from './store/action-creators/userActions'
import { UserInterface } from './store/types/userTypes'
import './styles/globals.css'

const App = () => {
	const dispatch = useDispatch()

	useEffect(() => {
		checkAuth()
			.then(res => {
				if (res.token) {
					localStorage.setItem('token', res.token)
					const decode: UserInterface = JwtDecode(res.token)
					dispatch(setUser(decode))
					dispatch(setIsAuth(true))
					if (decode.role === 'ADMIN') {
						dispatch(setIsAdmin(true))
					}
				}
			})
	}, [dispatch])

	return (
		<BrowserRouter>
			<AppRouter />
		</BrowserRouter>
	)
}

export default App
