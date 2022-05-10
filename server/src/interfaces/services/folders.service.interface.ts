export interface IFoldersService {
	createFolders(userId: number): Promise<void>
	getFolderContentIds(userId: number, folderName: string): Promise<number[] | null>
	getFolderContentAdded(userId: number, folderTable: string, filmId: number): Promise<string>
	deleteFolders(userId: number): Promise<void>
	addToFolder(userId: number, filmId: number, folderName: string): Promise<boolean>
	checkInFolder(userId: number, filmId: number, folderName: string): Promise<boolean>
}
