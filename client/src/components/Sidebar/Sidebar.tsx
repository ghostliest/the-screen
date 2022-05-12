import React, { useEffect, useState } from 'react'
import { ButtonText, ToggleSwitch, SelectDropdown } from 'components'
import { randomInRange } from 'utils/randomInRange'
import { getMeta } from 'API/contentApi'
import { TypeSort, TypeContentType } from 'API/types'
import { ISidebar } from './Sidebar.props'
import './Sidebar.css'

interface IInitialState {
	res: {
		id: number,
		value: string | any,
		placeholder?: string
	}[];
	selectedId: number;
}

const yearListGen = () => {
	const curYear = new Date().getFullYear()
	const startYear = 1900
	const rangeForList = 10
	const list = []
	const listRange = []
	let iterCountForListRange = Math.ceil((curYear - startYear) / 10)

	for (let i = curYear; i > curYear - rangeForList; i--) {
		list.push({ id: list.length + 1, value: String(i) })
	}

	for (let i = startYear; i < curYear; i += 10) {
		listRange.unshift({
			id: (list.length + 1) + --iterCountForListRange,
			value: [i, i + 9 > curYear ? curYear : i + 9].join('-')
		})
	}

	return [...list, ...listRange]
}

export const Sidebar = ({ setQuery }: ISidebar) => {
	const [contentType, setContentType] = useState({
		res: [
			{ id: 0, placeholder: 'All', value: 'all' },
			{ id: 1, placeholder: 'Films', value: 'film' },
			{ id: 2, placeholder: 'TV Series', value: 'series' }
		] as { id: number, placeholder: string, value: TypeContentType }[],
		selectedId: 0
	})

	const [selectSortBy, setSelectSortBy] = useState({
		res: [
			{ id: 0, placeholder: 'By popularity', value: 'popular' },
			{ id: 1, placeholder: 'By rating', value: 'rating' },
			{ id: 2, placeholder: 'By release date', value: 'date' }
		] as { id: number, placeholder: string, value: TypeSort }[],
		selectedId: 0
	})

	const [countries, setCountries] = useState({
		res: [
			{ id: 0, value: 'All countries' }
		],
		selectedId: 0
	})

	const [genres, setGenres] = useState({
		res: [
			{ id: 0, value: 'All genres' }
		],
		selectedId: 0
	})

	const [years, setYears] = useState({
		res: [
			{ id: 0, value: 'All years' },
			...yearListGen()
		],
		selectedId: 0
	})

	useEffect(() => {
		getMeta('country', 30)
			.then(res => {
				console.log('GET COUNTRIES RES: ', res)
				setCountries(p => ({ ...p, res: [...p.res, ...res] }))
			})
		getMeta('genre', 30)
			.then(res => {
				console.log('GET GENRES RES: ', res)
				setGenres(p => ({ ...p, res: [...p.res, ...res] }))
			})
	}, [])

	useEffect(() => {
		console.log('contentType: ', contentType)
		console.log('years: ', years)
		console.log('countries: ', countries)
		console.log('genres: ', genres)
	}, [contentType, years, countries, genres])

	useEffect(() => {
		console.log('SIDEBAR useEffect: ', { contentType, selectSortBy, countries, genres, years })

		setQuery(p => ({
			...p,
			page: 1,
			country: countries.selectedId,
			genre: genres.selectedId,
			type: contentType.res[contentType.selectedId].value,
			sort: selectSortBy.res[selectSortBy.selectedId].value,
			year: years.selectedId > 0 ? years.res[years.selectedId].value : ''
		}))
	}, [contentType.selectedId, selectSortBy.selectedId, countries.selectedId, genres.selectedId, years.selectedId])

	const setMenuValues = (id: number, setStateAction: React.Dispatch<React.SetStateAction<any>>) => {
		return setStateAction((p: any) => ({ ...p, selectedId: id }))
	}

	const handleRandom = () => {
		const randomRange = (stateValue: IInitialState) => {
			const min = 1
			const max = stateValue.res.length - 1
			return randomInRange(min, max)
		}

		setMenuValues(randomRange(countries), setCountries)
		setMenuValues(randomRange(genres), setGenres)
		setMenuValues(randomRange(years), setYears)
	}

	return (
		<div className="sidebar-container">
			<div className="widget sidebar-wrapper">
				<ToggleSwitch
					values={contentType.res}
					setValue={(selectId) => setMenuValues(selectId, setContentType)}
				/>
				<SelectDropdown
					currentId={selectSortBy.selectedId}
					menuValues={selectSortBy.res}
					setMenuValues={(selectId: number) => setMenuValues(selectId, setSelectSortBy)}
				/>
				<SelectDropdown
					currentId={countries.selectedId}
					menuValues={countries.res}
					setMenuValues={(selectId: number) => setMenuValues(selectId, setCountries)}
					border='PRIMARY'
				/>
				<SelectDropdown
					currentId={genres.selectedId}
					menuValues={genres.res}
					setMenuValues={(selectId: number) => setMenuValues(selectId, setGenres)}
					border='PRIMARY'
				/>
				<SelectDropdown
					currentId={years.selectedId}
					menuValues={years.res}
					setMenuValues={(selectId: number) => setMenuValues(selectId, setYears)}
					border='PRIMARY'
				/>
				<ButtonText type='PRIMARY' placeholder='Random parameters' onClick={() => handleRandom()} />
			</div>
		</div>
	)
}
