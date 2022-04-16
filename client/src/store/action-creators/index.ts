import * as ContentActionCreators from './contentActions'
import * as UserActionCreators from './userActions'
import * as FolderActionCreators from './folderActions'
import * as componentsInfoActionCreators from './componentsInfoActions'

export default {
	...ContentActionCreators,
	...UserActionCreators,
	...FolderActionCreators,
	...componentsInfoActionCreators
}
