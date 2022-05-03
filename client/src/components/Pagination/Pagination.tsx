import React, { useEffect, useState } from 'react'
import { ButtonText } from '../ButtonText/ButtonText'
import { IPagination } from './Pagination.props'
import './Pagination.css'

export const Pagination = ({ page, count, limit, setQuery }: IPagination) => {
	const [countPage, setCountPage] = useState(0)

	useEffect(() => {
		setCountPage(Math.ceil(count / limit))
	}, [count, limit])

	const handlePageClick = (setPage: number) => {
		if (page === setPage) return
		setQuery(p => ({ ...p, page: setPage }))
	}

	const handleArrowClick = (increaseBy: number) => {
		if (page + increaseBy > countPage) {
			handlePageClick(1)
		} else if (page + increaseBy < 1) {
			handlePageClick(countPage)
		} else {
			setQuery(p => ({ ...p, page: p.page! + increaseBy }))
		}
	}

	return (
		<div
			className='pagination-container'
			style={{ visibility: count ? 'visible' : 'hidden' }}
		>
			<ButtonText
				className='btn-pagination'
				style={{ visibility: countPage > 1 ? 'visible' : 'hidden' }}
				type='PRIMARY'
				placeholder='<'
				onClick={() => handleArrowClick(-1)}
			/>
			{
				new Array(countPage)
					.fill(0)
					.map((i, idx) => (
						<ButtonText
							className={`btn-pagination ${page === idx + 1 ? 'btn-pagination-active' : ''}`}
							key={idx}
							type='PRIMARY'
							placeholder={`${idx + 1}`}
							onClick={() => handlePageClick(idx + 1)}
						/>
					))
			}
			<ButtonText
				className='btn-pagination'
				style={{ visibility: countPage > 1 ? 'visible' : 'hidden' }}
				type='PRIMARY'
				placeholder='>'
				onClick={() => handleArrowClick(+1)}
			/>
		</div>
	)
}
