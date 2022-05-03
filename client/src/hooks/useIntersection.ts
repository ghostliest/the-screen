import React, { useState, useEffect } from 'react'

const useIntersection = (element: React.RefObject<any>, offset: string) => {
	const [isVisible, setState] = useState(false)

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				setState(entry.isIntersecting)
			}, { rootMargin: offset }
		)

		element?.current && observer.observe(element?.current)

		return () => element?.current && observer.unobserve(element?.current)
	}, [])

	return isVisible
}

export default useIntersection
