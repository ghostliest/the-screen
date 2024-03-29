import { useEffect, useState } from 'react'

const useScrollY = () => {
	const [scrollY, setScrollY] = useState(0)

	useEffect(() => {
		const onScroll = () => {
			setScrollY(window.scrollY)
		}

		window.addEventListener('scroll', onScroll)
		return () => window.removeEventListener('scroll', onScroll)
	}, [onscroll])

	return scrollY
}

export default useScrollY
