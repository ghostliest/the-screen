interface IFetchWrapper {
	url: string,
	method?: 'POST' | 'PUT' | 'GET',
	needToken?: boolean,
	body?: Object | FormData
}

export const fetchWrapper = async ({ url, method = 'GET', needToken, body }: IFetchWrapper) => {
	console.log('FROM FETCH-WRAPPER', { url, method, body, needToken })

	const setHeaders = () => {
		const headers = {} as any
		if (body instanceof FormData) {
			headers['Content-Type'] = 'multipart/form-data'
		} else {
			headers['Content-Type'] = 'application/json'
		}
		if (needToken) {
			headers.Authorization = `Bearer ${localStorage.getItem('token')}`
		}
		return headers
	}

	const setBody = () => {
		if (!body) return
		if (body instanceof FormData) {
			return body
		} else {
			return JSON.stringify(body)
		}
	}

	const init = () => {
		return {
			method: method,
			body: setBody(),
			headers: setHeaders()
		}
	}

	return await fetch(url, init())
		.then(res => res.json())
}
