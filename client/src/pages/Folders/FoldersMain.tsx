import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { folderType } from '../../API/types'
import { ReactComponent as WatchLaterIcon } from '../../assets/watchLater.svg'
import { ReactComponent as HeartIcon } from '../../assets/heart.svg'
import { ReactComponent as ViewedIcon } from '../../assets/viewed.svg'
import { ReactComponent as PlusIcon } from '../../assets/plus.svg'
import './FoldersMain.css'

export const FoldersMain = () => {
	const [menuItems] = useState<{ value: string, type: folderType | '', icon: React.ReactElement }[]>([
		{ value: 'Watch later', type: 'watchLater', icon: <WatchLaterIcon /> },
		{ value: 'Favorite', type: 'favorite', icon: <HeartIcon /> },
		{ value: 'Viewed', type: 'viewed', icon: <ViewedIcon /> },
		{ value: 'Create folder', type: '', icon: <PlusIcon /> }
	])

	return (
		<div className="widget folder_items-container">
			<div className='folder_items-wrapper'>
				<div className='folder_items'>
					<ul className='folders_list'>
						{
							menuItems.map(({ value, type, icon }, idx) => (
								<li key={idx}>
									<Link to={type}>
										<FolderItem name={value} icon={icon} />
									</Link>
								</li>
							))
						}
					</ul>
				</div>
			</div>
		</div>
	)
}

interface IFolderItem {
	name: string,
	icon: React.ReactElement
}

const FolderItem = ({ name, icon }: IFolderItem) => {
	return (
		<div className="folder_item-container">
			<div className="folder_item">
				<span className='folder-icon'>{icon}</span>
				<span className='folder-name'>
					<h2>{name}</h2>
				</span>
			</div>
		</div>
	)
}
