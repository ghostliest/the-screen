import { useEffect, useState } from 'react'

const useCheckScrollEnd = (offsetPx: number = 0) => {
	const [isScrollEnd, setScrollEnd] = useState(false)

	useEffect(() => {
		const onScroll = () => {
			if ((window.innerHeight + window.scrollY + offsetPx) >= document.body.offsetHeight) {
				setScrollEnd(true)
			} else {
				setScrollEnd(false)
			}
		}

		window.addEventListener('scroll', onScroll)
		return () => window.removeEventListener('scroll', onScroll)
	}, [onscroll])

	return isScrollEnd
}

export default useCheckScrollEnd
