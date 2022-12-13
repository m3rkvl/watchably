import classes from "./ExploreMovieCard.module.scss";
import movieDefPoster from "../../img/movie-poster-default.png";
import getMovieGenre from "../../util/getMovieGenre";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ToWatchIcon from "../../icons/ToWatchIcon";
import WatchedIcon from "../../icons/WatchedIcon";
import FavoriteIcon from "../../icons/FavoriteIcon";

const ExploreMovieCard = ({ data, index, topRated }) => {
  const [savedToWatch, setSavedToWatch] = useState(false);
  const [savedWatched, setSavedWatched] = useState(false);
  const [savedFavorite, setSavedFavorite] = useState(false);
  const [userRating, setUserRating] = useState("Not Rated");
  const moviesState = useSelector((state) => state.auth.userData.movies);

  //prettier-ignore
  const isToWatchActive = savedToWatch ? classes.toWatchActive : classes.toWatchInactive;
  //prettier-ignore
  const isWatchedActive = savedWatched ? classes.watchedActive : classes.watchedInactive;
  //prettier-ignore
  const isFavoriteActive = savedFavorite ? classes.favoriteActive : classes.favoriteInactive;

  //prettier-ignore
  const defPoster = movieDefPoster;
  //prettier-ignore
  const posterPath = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : defPoster;
  //prettier-ignore
  const coverClass = `${classes.cardCover} ${classes.movieCover}`;
  //prettier-ignore
  const genres = data.genre_ids?.map(genre => getMovieGenre(genre));
  //prettier-ignore
  const year = data?.release_date?.split("-")[0]
  //prettier-ignore
  const voteClass = classes.voteMovie;

  useEffect(() => {
    setSavedToWatch(moviesState.toWatch.some((e) => e.id === data.id));
    setSavedWatched(moviesState.watched.some((e) => e.id === data.id));
    setSavedFavorite(moviesState.favorites.some((e) => e.id === data.id));
    setUserRating((prev) => {
      if (moviesState.watched.find((e) => e.id === data.id)) {
        return moviesState.watched.find((e) => e.id === data.id).user_rating;
      } else {
        return "Not Rated";
      }
    });
  }, [
    data.id,
    data.media_type,
    moviesState.toWatch,
    moviesState.watched,
    moviesState.favorites,
  ]);

  return (
    <Link to={`/movies/${data.id}`} className={classes.movieCard}>
      <div className={classes.actions}>
        <div
          className={`${classes.btn} ${classes.toWatchPosition} ${isToWatchActive}`}
        >
          <ToWatchIcon />
        </div>
        <div
          className={`${classes.btn} ${classes.watchedPosition} ${isWatchedActive}`}
        >
          <WatchedIcon />
        </div>
        <div
          className={`${classes.btn} ${classes.favoritePosition} ${isFavoriteActive}`}
        >
          <FavoriteIcon />
        </div>
        {userRating && userRating !== "Not Rated" && (
          <div className={classes.userRating}>{userRating}</div>
        )}
      </div>

      {data.poster_path ? (
        ""
      ) : (
        <h2 className={classes.noPosterTxt}>{data.title}</h2>
      )}
      {topRated && (
        <p className={classes.index}>
          <span>{index + 1}</span>
        </p>
      )}
      <div className={coverClass}>
        <div className={classes.coverInfo}>
          <div className={classes.coverHeader}>
            <div className={classes.coverHeaderLeft}>
              <h2 className={classes.title}>{data.title}</h2>
              <h3 className={classes.year}>{year}</h3>
            </div>
            <div className={classes.coverHeaderRight}>
              <div className={`${classes.voteContainer} ${voteClass}`}>
                <span className={classes.voteAvg}>
                  {data.vote_average === 0 ? "?.?" : data.vote_average}
                </span>
                <p className={classes.voteCount}>
                  {data.vote_count === 0 ? "???" : data.vote_count}
                </p>
              </div>
            </div>
          </div>

          <div className={classes.genres}>
            {genres?.map((genre) => (
              <span key={Math.random()} className={classes.genre}>
                {genre}
              </span>
            ))}
          </div>
          <p className={classes.overview}>{data.overview}</p>
        </div>
      </div>
      <img
        className={classes.poster}
        src={posterPath}
        alt={`${data.title} Poster`}
      />
    </Link>
  );
};

export default ExploreMovieCard;

/*
genre_ids: (2) [18, 80]
id: 238
overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge."
popularity: 95.112
poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"
release_date: "1972-03-14"
title: "The Godfather"
vote_average: 8.7
vote_count: 17034
*/

/*
genre_ids: (2) [18, 37]
id: 68718
media_type: "movie"
overview: "With the help of a German bounty hunter, a freed slave sets out to rescue his wife from a brutal Mississippi plantation owner."
popularity: 47.925
poster_path: "/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg"
release_date: "2012-12-25"
title: "Django Unchained"
vote_average: 8.2
vote_count: 23323
*/

/*
first_air_date: "2017-03-31"
genre_ids: (2) [18, 9648]
id: 66788
media_type: "tv"
name: "13 Reasons Why"
overview: "After a teenage girl's perplexing suicide, a classmate receives a series of tapes that unravel the mystery of her tragic choice."
popularity: 56.982
poster_path: "/nel144y4dIOdFFid6twN5mAX9Yd.jpg"
vote_average: 7.7
vote_count: 3539
*/
