import * as ContentActionCreators from './contentActions'
import * as UserActionCreators from './userActions'

export default {
	...ContentActionCreators,
	...UserActionCreators
}
