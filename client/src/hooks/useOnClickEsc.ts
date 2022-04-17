import React, { useEffect } from 'react'

const useOnClickEsc = (checkValue: boolean, handler: React.Dispatch<React.SetStateAction<boolean>>) => {
	useEffect(() => {
		const listener = (event: any) => {
			if (event.keyCode === 27) handler(event)
		}
		document.addEventListener('keydown', listener)
		return () => {
			document.removeEventListener('keydown', listener)
		}
	}, [checkValue, handler])
}

export default useOnClickEsc
