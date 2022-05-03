import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import JwtDecode from 'jwt-decode'
import { login, registration } from '../../API/userApi'
import { setUser, setIsAdmin, setIsAuth, setLoading } from '../../store/action-creators/userActions'
import { useTypeSelector } from '../../hooks'
import { LOGIN_ROUTE, REGISTRATION_ROUTE, ADMIN_ROUTE } from '../../utils/consts'
import { ButtonArrow, ButtonText } from '../../components'
import './Auth.css'

export const Auth = () => {
	const { isAuth } = useTypeSelector(state => state.user)
	const { pathname } = useLocation()
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const isLogin = pathname === LOGIN_ROUTE

	const [searchParams] = useSearchParams()

	const [NEXT_ROUTE] = useState(searchParams.get('next') || '/')
	const [email, setEmail] = useState('')
	const [userName, setUserName] = useState('')
	const [loginIsVerified, setLoginIsVerified] = useState(false)
	const [isFirstSlide, setIsFirstSlide] = useState(true)
	const [password, setPassword] = useState('')
	const [errorMessage, setErrorMessage] = useState({ email: '', usr: '', pwd: '' })
	const [pos, setPos] = useState(0)
	const [opacity, setOpacity] = useState<'0' | '1'>('0')

	const inputEmailRef = useRef() as any

	useEffect(() => {
		setOpacity('1')
		dispatch(setLoading(true))
		if (isAuth) {
			return navigate(-1)
		} else {
			dispatch(setLoading(false))
		}
	}, [])

	useEffect(() => {
		inputEmailRef?.current?.focus()
	}, [pathname])

	const checkCorrectEmail = () => {
		if (!email) {
			setErrorMessage(p => ({ ...p, email: 'Field cannot be empty' }))
			return false
		}
		const emailArr = email.split('@')
		const checkEmail = emailArr.length === 2 && emailArr[0].length > 0 && emailArr[1].includes('.')
		if (!checkEmail) {
			setErrorMessage(p => ({ ...p, email: 'Check the correctness of your email' }))
			return false
		}
		return true
	}

	const handleClickLogin = (e: React.MouseEvent) => {
		e.preventDefault()
		if (checkCorrectEmail()) {
			login({ email, password })
				.then(res => {
					if (res.token) {
						localStorage.setItem('token', res.token)
						const decode = JwtDecode(res.token) as any
						const admin = decode.role === 'ADMIN'
						dispatch(setUser(decode))
						dispatch(setIsAdmin(admin))
						dispatch(setIsAuth(true))
						admin ?	navigate(ADMIN_ROUTE) : navigate(NEXT_ROUTE)
					} else if (res.canAuthorize) {
						setLoginIsVerified(true)
						setIsFirstSlide(false)
						setPos(-100)
					} else {
						if (loginIsVerified) {
							setErrorMessage(p => ({ ...p, pwd: res.message }))
						}
						setErrorMessage(p => ({ ...p, email: res.message }))
					}
				})
		}
	}

	const handleToRegistration = (e: React.MouseEvent) => {
		e.preventDefault()
		setErrorMessage({ email: '', usr: '', pwd: '' })
		navigate(`${REGISTRATION_ROUTE}?next=${NEXT_ROUTE}`)
	}

	const handleNextRegistration = (e: React.MouseEvent) => {
		e.preventDefault()
		if (userName.length < 4) {
			return setErrorMessage(p => ({ ...p, usr: 'Username is too short' }))
		}
		if (checkCorrectEmail()) {
			registration({ email, userName, password })
				.then(res => {
					if (res.token) {
						localStorage.setItem('token', res.token)
						const decode = JwtDecode(res.token) as any
						dispatch(setUser(decode))
						dispatch(setIsAuth(true))
						navigate(NEXT_ROUTE)
					} else if (res.canAuthorize) {
						setLoginIsVerified(true)
						setIsFirstSlide(false)
						setPos(-100)
					}
					setErrorMessage(p => ({ ...p, email: res.message }))
				})
		}
	}

	const handleGoBack = () => {
		setIsFirstSlide(true)
		setLoginIsVerified(false)
		setPos(0)
		setErrorMessage({ email: '', usr: '', pwd: '' })
		setPassword('')
	}

	return (
		<div className="container">
			<div className="passport-wrapper" style={{ opacity: opacity }}>
				<ButtonArrow
					arrow='left'
					className='btn-arrow-goback'
					onClick={loginIsVerified ? () => handleGoBack() : () => navigate(-1) }
				/>

				<>
					<div className="passport-header">
						<h1 className="passport-h1">{isLogin ? 'Login' : 'Registration'}</h1>
					</div>
					<div className="passport-route-wrapper">
						<div className="passport-route" style={{ transform: `translateX(${pos}%)` }}>
							{
								<>
									<div className="passport-route-enter" style={{ opacity: `${isFirstSlide ? '1' : '0'}` }}>
										<form action="" className="passport-form">
											<div className="passport-form-input">
												<input
													ref={inputEmailRef}
													onChange={(e) => setEmail(e.target.value)}
													className='auth-input'
													style={{ borderColor: `${errorMessage.email ? 'red' : ''}` }}
													type="text"
													placeholder="email"
												/>
												{
													!isLogin &&
													<input
														onChange={(e) => setUserName(e.target.value)}
														className='auth-input'
														style={{ borderColor: `${errorMessage.usr || errorMessage?.email?.includes('username') ? 'red' : ''}` }}
														type="text"
														placeholder="user name"
													/>
												}
												<div className='auth-input-message'>{errorMessage.email || errorMessage.usr || ''}</div>
											</div>

											<div className="passport-form-btns">
												{
													isLogin
														? <>
															<ButtonText
																type='PRIMARY'
																onClick={(e) => handleClickLogin(e)}
																placeholder='Sign in'
															/>
															<ButtonText
																type='SECONDARY'
																onClick={(e) => handleToRegistration(e)}
																placeholder='Create'
															/>
														</>
														: <ButtonText
															type='PRIMARY'
															onClick={(e) => handleNextRegistration(e)}
															placeholder='Next'
														/>
												}
											</div>

										</form>
									</div>

									<div className="passport-route-enter-wrapper" style={{ opacity: `${!isFirstSlide ? '1' : '0'}` }}>
										{
											loginIsVerified
												? <div className="passport-route-enter-done">
													<form action="" className="passport-form passport-form-password">
														{
															isLogin &&
															<div className="password_form-current_account">
																<div className="account-avatar_container">
																	<img src={process.env.REACT_APP_API_IMAGES_URL + 'avatar.jpg'} className='account-avatar' alt='avatar' />
																</div>
																<span className='account-name'>{email}</span>
															</div>
														}
														<div className="passport-form-input">
															<input
																className='auth-input'
																style={{ borderColor: `${errorMessage.pwd ? 'red' : ''}` }}
																type="password"
																placeholder="* * * * * * * *"
																autoFocus
																onChange={(e) => setPassword(e.target.value)}
															/>
															<div className='auth-input-message'>{errorMessage.pwd || ''}</div>
														</div>
														{
															isLogin
																? <ButtonText
																	type='PRIMARY'
																	onClick={(e) => handleClickLogin(e)}
																	placeholder='Sign in'
																/>
																: <ButtonText
																	type='PRIMARY'
																	onClick={(e) => handleNextRegistration(e)}
																	placeholder='Register'
																/>
														}
													</form>
												</div>
												: <></>
										}
									</div>
								</>
							}
						</div>
					</div>
				</>

			</div>
		</div>
	)
}
