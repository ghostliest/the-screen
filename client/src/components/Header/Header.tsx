import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useTypeSelector, useActions } from 'hooks'
import { SearchInput, ButtonIconText } from 'components'
import { ReactComponent as FolderIcon } from 'assets/folder.svg'
import { ReactComponent as SigninIcon } from 'assets/signin.svg'
import {
	FOLDERS_ROUTE,
	HOME_ROUTE,
	LOGIN_ROUTE,
	ADMIN_ROUTE
} from 'utils/consts'
import './Header.css'

export const Header = () => {
	const { isAuth, isAdmin, user } = useTypeSelector(state => state.user)
	const { height: stateHeight } = useTypeSelector(state => state.componentsInfo.header)

	const navigate = useNavigate()

	const location = useLocation()

	const { setLogout, setHeaderHeight } = useActions()

	const [height, setHeight] = useState(0)

	const headerRef = useRef() as any

	useEffect(() => {
		const elHeight = headerRef?.current?.getBoundingClientRect().height
		const elPadding = +window.getComputedStyle(headerRef?.current).padding.split('p')[0]
		setHeaderHeight(elHeight)
		console.log({ elHeight, elPadding })

		const onScroll = () => {
			if (window.scrollY > elHeight) {
				headerRef.current.style.padding = '10px'
				setHeight(elHeight - elPadding)
			} else if (window.scrollY < elHeight / 2) {
				headerRef.current.style.padding = `${elPadding}px`
				setHeight(elHeight)
			}
		}

		window.addEventListener('scroll', onScroll)
		return () => {
			window.removeEventListener('scroll', onScroll)
		}
	}, [])

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

	const handleSuggestItemClick = (type: any, id: any) => {
		console.warn('handleSuggestItemClick: ', `type: ${type} - id: ${id}`)
	}

	const hangleLoginClick = () => {
		navigate(`${LOGIN_ROUTE}?next=${location.pathname}`)
	}

	const handleScrollTop = () => {
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	const FolderBtn = () => {
		const handleFoldersClick = () => {
			if (isAuth) {
				if (location.pathname === FOLDERS_ROUTE) handleScrollTop()
				else navigate(`${FOLDERS_ROUTE}`)
			} else {
				navigate(`${LOGIN_ROUTE}?next=${FOLDERS_ROUTE}`)
			}
		}

		return (
			<div className="btn-folder">
				<ButtonIconText
					onClick={handleFoldersClick}
					text='Folders'
					transparent={true}>
					{<FolderIcon />}
				</ButtonIconText>
			</div>
		)
	}

	const AdminBtn = () => {
		const handleAdminClick = () => {
			location.pathname === ADMIN_ROUTE
				? handleScrollTop()
				: navigate(`${ADMIN_ROUTE}`)
		}

		return (
			<div className="btn-folder">
				<ButtonIconText
					onClick={handleAdminClick}
					text='Admin'
					transparent={true}>
					{<SigninIcon />}
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
									onClick={handleScrollTop}>
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
		<header className="header" ref={headerRef}>
			<div className="header-wrapper">
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
					<FolderBtn />
					{ isAdmin && <AdminBtn /> }
					{
						isAuth
							? <UserDropdown />
							:	<button
								className="btn btn-login"
								onClick={hangleLoginClick}>
								{'Login'}
							</button>
					}
				</div>
			</div>
		</header>
	)
}
