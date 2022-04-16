import React, { useEffect, useState } from 'react'
import { ContentItemsSlider } from '..'
import { getAllByIds } from '../../API/contentApi'
import LocalStorageHistory from '../../utils/LocalStorageHistory'
import { IHistorySlider } from './HistorySlider.props'
import './HistorySlider.css'

export const HistorySlider = ({ removeCurrentId = -1, visibleCount }: IHistorySlider) => {
	const [contentHistory, setContentHistory] = useState([])

	const checkItem = (id: number) => {
		if (removeCurrentId > 0) {
			LocalStorageHistory.filter(id)
			return LocalStorageHistory.getJson()
		}
		return LocalStorageHistory.getJson()
	}

	useEffect(() => {
		getAllByIds(checkItem(removeCurrentId))
			.then(res => {
				console.log('HistorySlider res: ', res)
				setContentHistory(res)
			})
	}, [removeCurrentId])

	return (
		contentHistory.length
			? <div className='history-slider'>
				<ContentItemsSlider
					visibleCount={visibleCount}
					content={contentHistory}
					title='Recently viewed'
				/>
			</div>
			: <></>
	)
}
