class LocalStorageHistory {
	private key = 'history'

	private get (): number[] {
		return JSON.parse(window.localStorage.getItem(this.key) || '[]')
	}

	private set (value: number[]) {
		window.localStorage.setItem(this.key, JSON.stringify(value))
	}

	private unshift (value: number) {
		this.set([value, ...this.get()])
	}

	public filter (value: number) {
		this.set(this.get().filter(i => i !== value))
	}

	public getJson () {
		return window.localStorage.getItem(this.key) || '[]'
	}

	public save (value: number) {
		const items = this.get()

		if (items?.length === 0) {
			this.set([value])
		} else {
			this.filter(value)
			this.unshift(value)
		}
	}

	public toTop (value: number) {
		this.filter(value)
		this.unshift(value)
	}
}

export default new LocalStorageHistory()
