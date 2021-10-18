import sequelize from '../db';
import { DataTypes } from 'sequelize';
import { FilmDetailsModelStatic, FilmModelStatic, FilmRatingInterfaceStatic } from '../types/filmsTypes';
import { UserModelInterfaceStatic } from '../types/userTypes';

const User = <UserModelInterfaceStatic>sequelize.define('user', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	email: { type: DataTypes.STRING, unique: true },
	username: { type: DataTypes.STRING, unique: true },
	password: { type: DataTypes.STRING },
	role: { type: DataTypes.STRING, defaultValue: "USER" },
});

const WatchLater = sequelize.define('watch-later', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Favorite = sequelize.define('favorite', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Viewed = sequelize.define('viewed', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const WatchLaterFilm = sequelize.define('watch-later_film', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const FavoriteFilm = sequelize.define('favorite_film', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const ViewedFilm = sequelize.define('viewed_film', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Film = <FilmModelStatic>sequelize.define('film', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	title: { type: DataTypes.STRING, unique: true, allowNull: false },
	year: { type: DataTypes.INTEGER, allowNull: false },
	completionYear: { type: DataTypes.INTEGER, allowNull: true },
	img: { type: DataTypes.STRING, allowNull: false },
	isFilm: { type: DataTypes.BOOLEAN, allowNull: false }
});

const FilmDetails = <FilmDetailsModelStatic>sequelize.define('film-details', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	ageRating: { type: DataTypes.INTEGER, allowNull: false },
	duration: { type: DataTypes.INTEGER, allowNull: false },
	description: { type: DataTypes.TEXT, allowNull: false },
	seasonCount: { type: DataTypes.INTEGER, allowNull: true },
	youtubeTrailerKey: { type: DataTypes.STRING, allowNull: false }
});

const FilmRating = <FilmRatingInterfaceStatic>sequelize.define('film-rating', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	ratingsCount: { type: DataTypes.INTEGER, allowNull: false },
	starsCount: { type: DataTypes.INTEGER, allowNull: false }
});

const UserRating = sequelize.define('user-rating', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	rating: { type: DataTypes.INTEGER, allowNull: false }
});

const Upcoming = sequelize.define('upcoming', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	img: { type: DataTypes.STRING, allowNull: false }
});

const Country = sequelize.define('country', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	countrie: { type: DataTypes.STRING, allowNull: false }
});

const Director = sequelize.define('director', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	director: { type: DataTypes.STRING, allowNull: false }
});

const Genre = sequelize.define('genre', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	genre: { type: DataTypes.STRING, allowNull: false }
});

const Star = sequelize.define('star', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	star: { type: DataTypes.STRING, allowNull: false }
});

const FilmDetailCountry = sequelize.define('film-detail_Country', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const FilmDetailDirector = sequelize.define('film-detail_Director', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const FilmDetailGenre = sequelize.define('film-detail_Genre', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const FilmDetailStar = sequelize.define('film-detail_Star', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});


User.hasOne(WatchLater)
WatchLater.belongsTo(User)

User.hasOne(Favorite)
Favorite.belongsTo(User)

User.hasOne(Viewed)
Viewed.belongsTo(User)

WatchLater.hasMany(WatchLaterFilm)
WatchLaterFilm.belongsTo(WatchLater)

Favorite.hasMany(FavoriteFilm)
FavoriteFilm.belongsTo(Favorite)

Viewed.hasMany(ViewedFilm)
ViewedFilm.belongsTo(Viewed)

Film.hasOne(WatchLaterFilm)
WatchLaterFilm.belongsTo(Film)

Film.hasOne(FavoriteFilm)
FavoriteFilm.belongsTo(Film)

Film.hasOne(ViewedFilm)
ViewedFilm.belongsTo(Film)

Film.hasMany(Upcoming)
Upcoming.belongsTo(Film)

Film.hasMany(UserRating)
UserRating.belongsTo(Film)

User.hasMany(UserRating)
UserRating.belongsTo(User)

Film.hasOne(FilmDetails, { as: "details", foreignKey: "filmId" })
FilmDetails.belongsTo(Film)

Film.hasOne(FilmRating, { as: "rating", foreignKey: "filmId" })
FilmRating.belongsTo(Film)

FilmDetails.hasMany(FilmDetailCountry)
FilmDetailCountry.belongsTo(FilmDetails)

FilmDetails.hasMany(FilmDetailDirector)
FilmDetailDirector.belongsTo(FilmDetails)

FilmDetails.hasMany(FilmDetailGenre)
FilmDetailGenre.belongsTo(FilmDetails)

FilmDetails.hasMany(FilmDetailStar)
FilmDetailStar.belongsTo(FilmDetails)

Country.hasMany(FilmDetailCountry)
FilmDetailCountry.belongsTo(Country)

Director.hasMany(FilmDetailDirector)
FilmDetailDirector.belongsTo(Director)

Genre.hasMany(FilmDetailGenre)
FilmDetailGenre.belongsTo(Genre)

Star.hasMany(FilmDetailStar)
FilmDetailStar.belongsTo(Star)

export {
	User,
	WatchLater,
	Favorite,
	Viewed,
	WatchLaterFilm,
	FavoriteFilm,
	ViewedFilm,
	Film,
	FilmRating,
	UserRating,
	FilmDetails,
	Upcoming,
	Country,
	Director,
	Genre,
	Star,
	FilmDetailCountry,
	FilmDetailDirector,
	FilmDetailGenre,
	FilmDetailStar
}