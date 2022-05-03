import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchContent } from '../../API/contentApi'
import { FILM_ROUTE, PERSON_ROUTE } from '../../utils/consts'
import { Spinner } from '..'
import { ReactComponent as SearchIcon } from './Search.svg'
import { ISearchRes } from '../../store/types/contentTypes'
import { ISearchInput, ISearchResultMenu } from './SearchInput.props'
import { useOnClickOutside, useOnClickEsc } from '../../hooks'
import './SearchInput.css'

const searchInitialState = { films: [], persons: [], message: '' }

export const SearchInput = ({ searchType, placeholder, autoFocus = true, redirect, handleSuggestItemClick }: ISearchInput) => {
	const [search, setSearch] = useState('')
	const [result, setResult] = useState<ISearchRes>(searchInitialState)
	const [resultError, setResultError] = useState('')
	const [visibleSuggest, setVisibleSuggest] = useState(false)
	const [spinner, setSpinner] = useState(false)
	const [cursorPos, setCursorPos] = useState(-1)

	const menuRef = useRef({} as any)
	const inputRef = useRef({} as any)
	const searchFormRef = useRef() as any

	useOnClickOutside(searchFormRef, () => setVisibleSuggest(false))
	useOnClickEsc(searchFormRef, () => setVisibleSuggest(false))

	const handleClickInput = (e: any) => {
		if (search && !visibleSuggest) {
			setVisibleSuggest(true)
			console.log('click input')
		}
	}

	const handleClickMenuItem = () => {
		setSearch('')
		setResult(searchInitialState)
		setResultError('')
		setVisibleSuggest(false)
		setCursorPos(-1)
		inputRef.current.focus()
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape')	{
			setVisibleSuggest(false)
		}	else if (e.key === 'ArrowUp') {
			e.preventDefault()
			if (cursorPos > 0) setCursorPos(prev => prev - 1)
		} else if (e.key === 'ArrowDown') {
			e.preventDefault()
			if (cursorPos < result.films.length - 1) setCursorPos(prev => prev + 1)
		} else if (e.key === 'Enter') {
			e.preventDefault()
			console.log('Event from handleKeyDown: ', e)
			console.log('Press Enter - from handleKeyDown')
		}
	}

	useEffect(() => {
		setResultError('')
		if (search) {
			setSpinner(true)
			setVisibleSuggest(true)
			searchContent(searchType, search)
				.then(res => {
					if (!res.message) {
						setResult(res)
						setSpinner(false)
						console.log('res:', res)
					} else {
						setResultError(res.message)
						setSpinner(false)
						console.log('RESULT ERROR: ', res.message)
					}
				})
		} else {
			setSpinner(false)
			setVisibleSuggest(false)
			setResult(searchInitialState)
		}
	}, [search])

	return (
		<div className="search-form" ref={searchFormRef}>
			<form action="">
				<div className="form-container">
					<input
						ref={inputRef}
						autoFocus={autoFocus}
						type="text"
						className='search-input'
						placeholder={placeholder}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onClick={(e) => handleClickInput(e)}
						onKeyDown={(e) => handleKeyDown(e)} />
					<button className="btn btn-submit" onClick={(e) => e.preventDefault()}>
						<SearchIcon />
					</button>
				</div>
			</form>

			{
				visibleSuggest
					? <>
						<div className="suggest-container" ref={menuRef}>
							<div className="suggest-search">
								{
									spinner
										?	<Spinner style={{ margin: '15px' }} />
										: <SearchResultMenu
											cursorPos={cursorPos}
											result={result}
											resultError={resultError}
											redirect={redirect}
											handleClickMenuItem={handleClickMenuItem}
											handleSuggestItemClick={handleSuggestItemClick}
										/>
								}
							</div>
						</div>
					</>
					: <></>
			}

		</div>
	)
}

const SearchResultMenu = ({ redirect = true, handleClickMenuItem, handleSuggestItemClick = () => {}, result, resultError, cursorPos }: ISearchResultMenu) => {
	const MenuLi = ({ item }: any) => {
		const ROUTE = item.name ? PERSON_ROUTE : FILM_ROUTE
		return (
			<Link
				to={redirect ? `${ROUTE}/${item.id}` : ''}
				onClick={() => {
					handleClickMenuItem()
					handleSuggestItemClick(item.id)
				}}
			>
				<div className="search-item-container">
					<div className="search-item-img">
						{
							item?.img
								? <img src={process.env.REACT_APP_API_IMAGES_URL + item?.img} />
								: <div className='search-item-withoutimg'>?</div>
						}
					</div>
					<div className="search-item-info">
						<h4 className="search-info-title">{item.title || item.name}</h4>
						{
							item?.year && <div className="search-info-subtitle">
								<span className="search-info-year">{item?.year + ', '}</span>
								{item?.rating && <div className="search-info-rating">{item?.rating?.ratingsCount > 0 ? item?.rating?.starsCount / item?.rating?.ratingsCount : 0}</div>}
							</div>
						}
					</div>
				</div>
			</Link>
		)
	}

	return (
		<div className="search-group">
			<div className="search-container">
				{
					resultError
						? <h4 className='search-notfound'>{resultError}</h4>
						: <ul className="search-item">
							{
								Object.keys(result)
									.map((i: any) => (
										result[i].map((j: any) => (
											<li key={j.id}>
												<MenuLi item={j} />
											</li>
										))
									))
							}
						</ul>
				}
			</div>
		</div>
	)
}
