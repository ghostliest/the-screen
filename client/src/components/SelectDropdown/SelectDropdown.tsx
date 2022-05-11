import React, { useRef, useState } from 'react'
import { useOnClickEsc, useOnClickOutside } from '../../hooks'
import { ReactComponent as DoneIcon } from '../../assets/done.svg'
import { ReactComponent as TriangleIcon } from '../../assets/triangle.svg'
import { ISelectDropdown } from './SelectDropdown.props'
import './SelectDropdown.css'

export const SelectDropdown = ({ currentId, menuValues, setMenuValues, border = 'DEFAULT' }: ISelectDropdown) => {
	const [isShowMenu, setIsShowMenu] = useState(false)
	const menuRef = useRef({}) as any

	useOnClickOutside(menuRef, () => setIsShowMenu(false))
	useOnClickEsc(isShowMenu, () => setIsShowMenu(false))

	return (
		<div className="select_dropdown_container" onClick={() => setIsShowMenu(p => !p)}>
			<div className={`select_dropdown_wrapper ${border === 'DEFAULT' ? 'select_dropdown-border_default' : 'select_dropdown-border_primary'}`} ref={menuRef}>
				<div className="select_dropdown-label-container">
					<span className="select_dropdown-label">
						{menuValues[currentId].placeholder || menuValues[currentId].value}
					</span>
					<div>
						<TriangleIcon />
					</div>
				</div>
				{
					isShowMenu &&
					<div className="select_dropdown_menu_container">
						<div className="select_dropdown_menu_wrapper">
							{
								menuValues.map(({ id, placeholder, value }) => (
									<div key={id} className="select_dropdown_menu_item" onClick={() => setMenuValues(id)}>
										<span className='select_dropdown_menu_item-icon'>
											{ currentId === id && <DoneIcon /> }
										</span>
										<span className="select_dropdown_menu_item-title">{placeholder || value}</span>
									</div>
								))
							}
						</div>
					</div>
				}
			</div>
		</div>
	)
}
