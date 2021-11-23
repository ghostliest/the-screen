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

const WatchLater = sequelize.define('watchLater', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Favorite = sequelize.define('favorite', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const Viewed = sequelize.define('viewed', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const WatchLaterFilm = sequelize.define('watchLater_film', {
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
	country: { type: DataTypes.STRING, allowNull: false }
});

const Director = sequelize.define('director', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, allowNull: false }
});

const Genre = sequelize.define('genre', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	genre: { type: DataTypes.STRING, allowNull: false }
});

const Actor = sequelize.define('actor', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
	name: { type: DataTypes.STRING, allowNull: false }
});

const FilmDetailCountry = sequelize.define('film-detail_country', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const FilmDetailDirector = sequelize.define('film-detail_director', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const FilmDetailGenre = sequelize.define('film-detail_genre', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});

const FilmDetailActor = sequelize.define('film-detail_actor', {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
});


User.hasOne(WatchLater, { as: "watchLater" })
WatchLater.belongsTo(User)

User.hasOne(Favorite, { as: "favorite" })
Favorite.belongsTo(User)

User.hasOne(Viewed, { as: "viewed" })
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

FilmDetails.hasMany(FilmDetailCountry, { as: "countries" })
FilmDetailCountry.belongsTo(FilmDetails)

FilmDetails.hasMany(FilmDetailDirector, { as: "directors" })
FilmDetailDirector.belongsTo(FilmDetails)

FilmDetails.hasMany(FilmDetailGenre, { as: "genres" })
FilmDetailGenre.belongsTo(FilmDetails)

FilmDetails.hasMany(FilmDetailActor, { as: "actors" })
FilmDetailActor.belongsTo(FilmDetails)

Country.hasMany(FilmDetailCountry)
FilmDetailCountry.belongsTo(Country)

Director.hasMany(FilmDetailDirector)
FilmDetailDirector.belongsTo(Director)

Genre.hasMany(FilmDetailGenre)
FilmDetailGenre.belongsTo(Genre)

Actor.hasMany(FilmDetailActor)
FilmDetailActor.belongsTo(Actor, { as: "actor" })

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
	Actor,
	FilmDetailCountry,
	FilmDetailDirector,
	FilmDetailGenre,
	FilmDetailActor
}