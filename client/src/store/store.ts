import { createStore, compose } from 'redux'
import { rootReducer } from './reducers/rootReducer'

let composeEnhancers

if (process.env.REACT_APP_NODE_ENV === 'development') {
	composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
	(window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
		trace: true,
		traceLimit: 25
	})
} else {
	composeEnhancers = compose
}

export const store = createStore(
	rootReducer,
	composeEnhancers()
)
