import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTypeSelector, useActions } from '../../hooks'
import {
	FOLDERS_ROUTE,
	HOME_ROUTE,
	LOGIN_ROUTE
} from '../../utils/consts'
import { SearchInput, ButtonIconText } from '..'
import { ReactComponent as FolderIcon } from './folder.svg'
import './Header.css'

export const Header = () => {
	const { isAuth, user } = useTypeSelector(state => state.user)
	const { height: stateHeight } = useTypeSelector(state => state.componentsInfo.header)

	const navigate = useNavigate()

	const location = useLocation()

	const { setLogout, setHeaderHeight } = useActions()

	const [height, setHeight] = useState(0)

	const headerRef = useRef() as any

	useEffect(() => {
		console.log('location: ', location)
	}, [location])

	const onScroll = (elHeight: number, elPadding: number) => {
		if (headerRef?.current) {
			const scrollPos = window.scrollY
			if (scrollPos > elHeight) {
				headerRef.current.style.padding = '10px'
				setHeight(elHeight - elPadding)
			} else {
				headerRef.current.style.padding = `${elPadding}px`
				setHeight(elHeight)
			}
		}
	}

	useEffect(() => {
		const elHeight = headerRef?.current?.getBoundingClientRect().height
		const elPadding = +window.getComputedStyle(headerRef?.current).padding.split('p')[0]
		onScroll(elHeight, elPadding)
	}, [])

	useEffect(() => {
		const elHeight = headerRef?.current?.getBoundingClientRect().height
		const elPadding = +window.getComputedStyle(headerRef?.current).padding.split('p')[0]

		window.addEventListener('scroll', () => onScroll(elHeight, elPadding))
		return () => window.removeEventListener('scroll', () => onScroll(elHeight, elPadding))
	}, [onscroll])

	useEffect(() => {
		if (stateHeight !== height) {
			setHeaderHeight(height)
		}
	}, [height])

	const handleClickLogout = (e: React.MouseEvent) => {
		e.preventDefault()
		const exit = confirm('Are you sure want to get out')
		if (exit) {
			localStorage.removeItem('token')
			setLogout()
			navigate(HOME_ROUTE)
		}
	}

	const handleFoldersClick = () => {
		return isAuth
			? navigate(`${FOLDERS_ROUTE}`)
			: navigate(`${LOGIN_ROUTE}?next=${FOLDERS_ROUTE}`)
	}

	const handleSuggestItemClick = (type: any, id: any) => {
		console.warn('handleSuggestItemClick: ', `type: ${type} - id: ${id}`)
	}

	const hangleLoginClick = () => {
		navigate(`${LOGIN_ROUTE}?next=${location.pathname}`)
	}

	const handleFromHomeLogoClick = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const FolderBtn = () => {
		return (
			<div className="btn-folder">
				<ButtonIconText
					onClick={() => handleFoldersClick()}
					text='Folders'
					transparent={true}>
					{<FolderIcon />}
				</ButtonIconText>
			</div>
		)
	}

	const UserDropdown = () => {
		return (
			<div className="dropdown_container">
				<div className="avatar avatar-header">
					<img src={process.env.REACT_APP_API_IMAGES_URL + 'avatar.jpg'} alt="avatar" />
				</div>
				<div className="dropdown">
					<div className="user-info_container">
						<div className="user-info">
							<div className="user-info_name">{user?.email.split('@')[0]}</div>
							<div className="user-info_email">{user?.email}</div>
						</div>
						<div className="avatar">
							<img src={process.env.REACT_APP_API_IMAGES_URL + 'avatar.jpg'} alt="avatar" />
						</div>
					</div>
					<div className="navigation">
						<nav>
							<ul className="navigation-content">
								<li>
									<Link to={`${FOLDERS_ROUTE}/viewed`} className="menu-link">Ratings and views</Link>
								</li>
								<li>
									<Link to={`${FOLDERS_ROUTE}/favorite`} className="menu-link">Films</Link>
								</li>
							</ul>
							<ul className="navigation-user">
								<li>
									<Link to={''} className="menu-link">Settings</Link>
								</li>
								<li>
									<button className="btn menu-btn" onClick={(e) => handleClickLogout(e)}>Logout</button>
								</li>
							</ul>
						</nav>
					</div>
				</div>
			</div>
		)
	}

	const Logo = () => {
		return (
			<div className="header-logo">
				<Link to="/">
					<div className="header-logo-container">
						{
							location.pathname === '/'
								? <span
									className='header-logo-first link'
									onClick={() => handleFromHomeLogoClick()}>
									{'The screen'}
								</span>
								: <div className="header-logo-wrapper">
									<span className='header-logo-first'>The screen</span>
									<span className='header-logo-second'>Home</span>
								</div>
						}
					</div>
				</Link>
			</div>
		)
	}

	return (
		<div className="header-wrapper" ref={headerRef}>
			<header className="header">
				<Logo />
				<div className='search_input-header'>
					<SearchInput
						redirect={true}
						searchType='all'
						placeholder='Movies, TV series, persons'
						handleSuggestItemClick={handleSuggestItemClick}
					/>
				</div>

				<div className="user-container">
					{ location.pathname !== FOLDERS_ROUTE && <FolderBtn /> }
					{
						isAuth
							? <UserDropdown />
							:	<button
								className="btn btn-login"
								onClick={() => hangleLoginClick()}>
								{'Login'}
							</button>
					}
				</div>
			</header>
		</div>
	)
}
