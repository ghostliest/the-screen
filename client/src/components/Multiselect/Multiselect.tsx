import React, { useRef, useState } from 'react'
import { Spinner } from '..'
import { ReactComponent as ArrowIcon } from './arrow.svg'
import { ReactComponent as ClearIcon } from './clear.svg'
import { search } from '../../API/contentApi'
import { IMultiselect } from './Multiselect.props'
import './Multiselect.css'

export const Multiselect = ({ placeholder, searchType, menuValues, setMenuValues }: IMultiselect) => {
	const [visibleMenu, setVisibleMenu] = useState(false)
	const [searchValues, setSearchValues] = useState([]) as any
	const [isLoading, setIsLoading] = useState(false)

	const inputRef = useRef(null) as any
	const selectMenuRef = useRef(null) as any

	const handleInputChange = (value: string) => {
		if (value) {
			setIsLoading(true)
			setVisibleMenu(true)
			search(searchType, value)
				.then(res => {
					const val = Object.keys(res)
					setSearchValues(res[val[0]])
					setIsLoading(false)
				})
		} else {
			setIsLoading(false)
			setVisibleMenu(false)
			setSearchValues({})
		}
	}

	const handleMenuItemClick = (id: number, value: string) => {
		const isIncludeInInitial = menuValues.initial.includes(id)
		const idsInView = menuValues.view.map(i => i.id)
		if (!idsInView.includes(id)) {
			setMenuValues(prev => ({
				...prev,
				view: [...prev.view, { id, value }],
				to: {
					add: isIncludeInInitial ? prev.to.add : [...prev.to.add.filter(i => i !== id), id],
					delete: prev.to.delete.filter(i => i !== id)
				}
			}))
			setVisibleMenu(false)
			inputRef.current.value = ''
			inputRef.current.focus()
		}
	}

	const handleRemoveItemClick = (id: number) => {
		const isIncludeInInitial = menuValues.initial.includes(id)
		setMenuValues(prev => ({
			...prev,
			view: [...prev.view.filter(i => i.id !== id)],
			to: {
				add: [...prev.to.add.filter(i => i !== id)],
				delete: isIncludeInInitial ? [...prev.to.delete, id] : prev.to.delete
			}
		}))
	}

	const handleRemoveAllItems = () => {
		setMenuValues(prev => ({
			...prev,
			to: {
				add: [],
				delete: [...prev.initial]
			},
			view: []
		}))
	}

	const Content = () => {
		return (
			<>
				{menuValues.view.map(({ id, value }: any) => (
					<div key={id} className="multi_value">
						<div className="multi_value-label_container">
							<div className="multi_value-label">{value}</div>
						</div>
						<span className="separator multi_value-separator"></span>
						<div className="multi_value-btns_container">
							<div className="multi_value-btn multi_value-remove" onClick={() => handleRemoveItemClick(id)}>
								<ClearIcon />
							</div>
						</div>
					</div>
				))}
			</>
		)
	}

	const Menu = () => {
		return (
			<div className="select_menu" ref={selectMenuRef}>
				{
					isLoading
						? <Spinner className='search_state' fullScreen={false} />
						: searchValues.length > 0
							? searchValues.map(({ id, value }: any) => (
								<div key={id} className="select_menu-item" onClick={() => handleMenuItemClick(id, value)}>{value}</div>
							))
							: <div className="search_menu-notfound-container">
								<h4 className='search_menu-header'>Nothing found</h4>
								<button className="btn btn-text select_menu-create_btn">
									<span>+</span>
									<span className='separator btn_create-separator'></span>
									<span>{placeholder}</span>
								</button>
							</div>
				}
			</div>
		)
	}

	return (
		<div className="multi_select-container" onClick={() => inputRef.current.focus()}>
			<div className='multi_select-control'>
				<div className="select_value-container">
					{ menuValues && <Content /> }
					<div className="select_input-container">
						<input
							className='select_input'
							type="text"
							ref={inputRef}
							placeholder={menuValues.view.length > 0 ? '' : placeholder}
							onChange={(e) => handleInputChange(e.target.value)} />
					</div>
				</div>
				<div className="select_indicators-container">
					{
						!!menuValues.view.length &&
						<>
							<div
								className="select_clear-indicator multi_value-remove"
								onClick={() => handleRemoveAllItems()}
							>
								<ClearIcon />
							</div>
							<span className="separator select-separator"></span>
						</>
					}
					<div
						className="select_dropdown-indicator"
						onClick={() => setVisibleMenu(!visibleMenu)}
					>
						<ArrowIcon />
					</div>
				</div>
			</div>
			{	visibleMenu && <Menu />	}
		</div>
	)
}
