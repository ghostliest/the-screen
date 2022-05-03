import { createStore } from 'redux'
import { rootReducer } from './reducers/rootReducer'

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
	(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
		trace: true,
		traceLimit: 25
	})

export const store = createStore(
	rootReducer,
	composeEnhancers()
)
