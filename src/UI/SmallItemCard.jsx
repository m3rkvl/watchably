import classes from "./SmallItemCard.module.scss";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import movieDefPoster from "../img/movie-poster-default.png";
import seriesDefPoster from "../img/series-poster-default.png";
import { Link } from "react-router-dom";
import getMovieGenre from "../util/getMovieGenre";
import getSeriesGenre from "../util/getSeriesGenre";

import ToWatchIcon from "../icons/ToWatchIcon";
import WatchedIcon from "../icons/WatchedIcon";
import FavoriteIcon from "../icons/FavoriteIcon";
import { UserAuth } from "../context/AuthContext";

const LibraryItemCard = ({ data }) => {
  const {
    user,
    saveToWatchMovie,
    deleteToWatchMovie,
    saveWatchedMovie,
    deleteWatchedMovie,
    saveFavoriteMovie,
    deleteFavoriteMovie,
    saveToWatchSeries,
    deleteToWatchSeries,
    saveWatchedSeries,
    deleteWatchedSeries,
    saveFavoriteSeries,
    deleteFavoriteSeries,
  } = UserAuth();

  const [savedToWatch, setSavedToWatch] = useState(false);
  const [savedWatched, setSavedWatched] = useState(false);
  const [savedFavorite, setSavedFavorite] = useState(false);
  const [userRating, setUserRating] = useState("Not Rated");
  const moviesState = useSelector((state) => state.auth.userData.movies);
  const seriesState = useSelector((state) => state.auth.userData.series);

  //prettier-ignore
  const defPoster = data.media_type === "movie" ? movieDefPoster : seriesDefPoster;
  //prettier-ignore
  const posterPath = data.poster_path && data.poster_path !== "??" ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : defPoster;
  //prettier-ignore
  const coverClass = `${classes.cardCover} ${ data.media_type === "movie" ? classes.movieCover : classes.seriesCover}`;
  //prettier-ignore
  let genres;
  //prettier-ignore
  const year = data?.release_date?.split("-")[0] || data?.first_air_date?.split("-")[0]
  //prettier-ignore
  const voteClass = data.media_type === "movie" ? classes.voteMovie : classes.voteSeries;

  let saveToWatchHandler;
  let saveWatchedHandler;
  let saveFavoriteHandler;
  let userRatingHandler;

  if (data.media_type === "movie") {
    genres = data?.genre_ids.map((genre) => {
      if (genre.name) return genre.name;
      else return getMovieGenre(genre);
    });

    const movieObj = {
      genre_ids: data.genre_ids || "??",
      id: data.id || "??",
      media_type: "movie",
      overview: data.overview || "??",
      popularity: data.popularity || "??",
      poster_path: data.poster_path || "??",
      release_date: data.release_date || "????",
      title: data.title || "??",
      vote_average: data.vote_average || "??",
      vote_count: data.vote_count || "??",
      listed_at: Date.now(),
    };

    saveToWatchHandler = async (e) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      // Check if user exists
      if (!user?.email)
        alert("Please sign in to save a movie to your to watch list! :)");

      if (savedWatched) {
        if (savedFavorite) {
          await deleteFavoriteMovie(movieObj);
          await deleteWatchedMovie(movieObj);
          await saveToWatchMovie(movieObj);
        }

        if (!savedFavorite) {
          await deleteWatchedMovie(movieObj);
          await saveToWatchMovie(movieObj);
        }
      }

      if (!savedWatched) {
        if (savedToWatch) await deleteToWatchMovie(movieObj);
        if (!savedToWatch) await saveToWatchMovie(movieObj);
      }
    };
    saveWatchedHandler = async (e) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      if (!user?.email)
        alert("Please sign in to save a movie to your to watch list! :)");

      if (savedToWatch) {
        await deleteToWatchMovie(movieObj);
        await saveWatchedMovie(movieObj);
      }

      if (!savedToWatch) {
        if (savedWatched) {
          if (savedFavorite) {
            await deleteFavoriteMovie(movieObj);
            await deleteWatchedMovie(movieObj);
          }

          if (!savedFavorite) await deleteWatchedMovie(movieObj);
        }

        if (!savedWatched) await saveWatchedMovie(movieObj);
      }
    };
    saveFavoriteHandler = async (e) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      if (savedToWatch) return;
      if (!savedWatched) return;
      if (savedWatched) {
        if (savedFavorite) await deleteFavoriteMovie(movieObj);
        if (!savedFavorite) await saveFavoriteMovie(movieObj);
      }
    };

    userRatingHandler = async (e) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      if (e.target.value === "Not Rated") {
        setUserRating((prev) => e.target.value);
        movieObj.user_rating = e.target.value;

        if (savedWatched) {
          if (savedFavorite) {
            await deleteFavoriteMovie(movieObj);
            await deleteWatchedMovie(movieObj);
            await saveFavoriteMovie(movieObj);
            await saveWatchedMovie(movieObj);
          }

          if (!savedFavorite) {
            await deleteWatchedMovie(movieObj);
            await saveWatchedMovie(movieObj);
          }
        }
        return;
      }

      setUserRating((prev) => +e.target.value);
      movieObj.user_rating = +e.target.value;

      if (savedToWatch) return;
      if (!savedWatched) return;

      if (savedWatched) {
        if (savedFavorite && +e.target.value >= 9) {
          await deleteFavoriteMovie(movieObj);
          await deleteWatchedMovie(movieObj);
          await saveFavoriteMovie(movieObj);
          await saveWatchedMovie(movieObj);
        }

        if (savedFavorite && +e.target.value < 9) {
          await deleteFavoriteMovie(movieObj);
          await deleteWatchedMovie(movieObj);
          await saveWatchedMovie(movieObj);
        }

        if (!savedFavorite && +e.target.value >= 9) {
          await deleteFavoriteMovie(movieObj);
          await deleteWatchedMovie(movieObj);
          await saveFavoriteMovie(movieObj);
          await saveWatchedMovie(movieObj);
        }

        if (!savedFavorite && +e.target.value < 9) {
          await deleteWatchedMovie(movieObj);
          await saveWatchedMovie(movieObj);
        }
      }
    };
  }

  if (data.media_type === "tv") {
    genres = data?.genre_ids.map((genre) => {
      if (genre.name) return genre.name;
      else return getSeriesGenre(genre);
    });

    const seriesObj = {
      genre_ids: data.genre_ids || "??",
      id: data.id || "??",
      media_type: "tv",
      overview: data.overview || "??",
      popularity: data.popularity || "??",
      poster_path: data.poster_path || "??",
      first_air_date: data.first_air_date || "????",
      name: data.name || "??",
      vote_average: data.vote_average || "??",
      vote_count: data.vote_count || "??",
      listed_at: Date.now(),
    };

    saveToWatchHandler = async (e) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      // Check if user exists
      if (!user?.email)
        alert("Please sign in to save a series to your to watch list! :)");

      if (savedWatched) {
        if (savedFavorite) {
          await deleteFavoriteSeries(seriesObj);
          await deleteWatchedSeries(seriesObj);
          await saveToWatchSeries(seriesObj);
        }

        if (!savedFavorite) {
          await deleteWatchedSeries(seriesObj);
          await saveToWatchSeries(seriesObj);
        }
      }

      if (!savedWatched) {
        if (savedToWatch) await deleteToWatchSeries(seriesObj);
        if (!savedToWatch) await saveToWatchSeries(seriesObj);
      }
    };
    saveWatchedHandler = async (e) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      if (!user?.email)
        alert("Please sign in to save a movie to your to watch list! :)");

      if (savedToWatch) {
        await deleteToWatchSeries(seriesObj);
        await saveWatchedSeries(seriesObj);
      }

      if (!savedToWatch) {
        if (savedWatched) {
          if (savedFavorite) {
            await deleteFavoriteSeries(seriesObj);
            await deleteWatchedSeries(seriesObj);
          }

          if (!savedFavorite) await deleteWatchedSeries(seriesObj);
        }

        if (!savedWatched) await saveWatchedSeries(seriesObj);
      }
    };
    saveFavoriteHandler = async (e) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      if (savedToWatch) return;
      if (!savedWatched) return;
      if (savedWatched) {
        if (savedFavorite) await deleteFavoriteSeries(seriesObj);
        if (!savedFavorite) await saveFavoriteSeries(seriesObj);
      }
    };

    userRatingHandler = async (e) => {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
      if (e.target.value === "Not Rated") {
        setUserRating((prev) => e.target.value);
        seriesObj.user_rating = e.target.value;

        if (savedWatched) {
          if (savedFavorite) {
            await deleteFavoriteSeries(seriesObj);
            await deleteWatchedSeries(seriesObj);
            await saveFavoriteSeries(seriesObj);
            await saveWatchedSeries(seriesObj);
          }

          if (!savedFavorite) {
            await deleteWatchedSeries(seriesObj);
            await saveWatchedSeries(seriesObj);
          }
        }
        return;
      }

      setUserRating((prev) => +e.target.value);
      seriesObj.user_rating = +e.target.value;

      if (savedToWatch) return;
      if (!savedWatched) return;

      if (savedWatched) {
        if (savedFavorite && +e.target.value >= 9) {
          await deleteFavoriteSeries(seriesObj);
          await deleteWatchedSeries(seriesObj);
          await saveFavoriteSeries(seriesObj);
          await saveWatchedSeries(seriesObj);
        }

        if (savedFavorite && +e.target.value < 9) {
          await deleteFavoriteSeries(seriesObj);
          await deleteWatchedSeries(seriesObj);
          await saveWatchedSeries(seriesObj);
        }

        if (!savedFavorite && +e.target.value >= 9) {
          await deleteFavoriteSeries(seriesObj);
          await deleteWatchedSeries(seriesObj);
          await saveFavoriteSeries(seriesObj);
          await saveWatchedSeries(seriesObj);
        }

        if (!savedFavorite && +e.target.value < 9) {
          await deleteWatchedSeries(seriesObj);
          await saveWatchedSeries(seriesObj);
        }
      }
    };
  }

  const isToWatchActive = savedToWatch
    ? classes.toWatchActive
    : classes.toWatchInactive;
  const isWatchedActive = savedWatched
    ? classes.watchedActive
    : classes.watchedInactive;
  const isFavoriteActive = savedFavorite
    ? classes.favoriteActive
    : classes.favoriteInactive;

  useEffect(() => {
    if (data.media_type === "movie") {
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
    }

    if (data.media_type === "tv") {
      setSavedToWatch(seriesState.toWatch.some((e) => e.id === data.id));
      setSavedWatched(seriesState.watched.some((e) => e.id === data.id));
      setSavedFavorite(seriesState.favorites.some((e) => e.id === data.id));
      setUserRating((prev) => {
        if (seriesState.watched.find((e) => e.id === data.id)) {
          return seriesState.watched.find((e) => e.id === data.id).user_rating;
        } else {
          return "Not Rated";
        }
      });
    }
  }, [
    data.id,
    data.media_type,
    moviesState.toWatch,
    moviesState.watched,
    moviesState.favorites,
    seriesState.toWatch,
    seriesState.watched,
    seriesState.favorites,
  ]);

  return (
    <article className={classes.movieCardContainer}>
      <div className={classes.actions}>
        <button
          onClick={saveToWatchHandler}
          className={`${classes.btn} ${classes.toWatchPosition} ${isToWatchActive}`}
        >
          <ToWatchIcon />
        </button>
        <button
          onClick={saveWatchedHandler}
          className={`${classes.btn} ${classes.watchedPosition} ${isWatchedActive}`}
        >
          <WatchedIcon />
        </button>
        <button
          onClick={saveFavoriteHandler}
          disabled={savedToWatch || !savedWatched}
          className={`${classes.btn} ${classes.favoritePosition} ${isFavoriteActive}`}
        >
          <FavoriteIcon />
        </button>
        <div className={classes.userRateContainer}>
          <select
            value={userRating}
            onChange={userRatingHandler}
            disabled={!savedWatched}
          >
            <option value={"Not Rated"}>Your Rate</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
          </select>
          <span className={classes.userRateFocus}></span>
        </div>
      </div>

      <Link
        to={`/${data.media_type === "movie" ? "movies" : "series"}/${data.id}`}
        className={classes.movieCard}
      >
        {data.poster_path && data.poster_path !== "??" ? (
          ""
        ) : (
          <h2 className={classes.noPosterTxt}>{data.title || data.name}</h2>
        )}
        <div className={coverClass}>
          <div className={classes.coverInfo}>
            <div className={classes.coverHeader}>
              <div className={classes.coverHeaderLeft}>
                <h2 className={classes.title}>{data.title || data.name}</h2>
                <h3 className={classes.year}>{year}</h3>
              </div>
              <div className={classes.coverHeaderRight}>
                <div className={`${classes.voteContainer} ${voteClass}`}>
                  <span className={classes.voteAvg}>
                    {data.vote_average === 0 ||
                    typeof data.vote_average !== "number"
                      ? "?.?"
                      : data.vote_average.toFixed(1)}
                  </span>
                  <p className={classes.voteCount}>
                    {data.vote_count === 0
                      ? "???"
                      : data.vote_count.toLocaleString("en-US")}
                  </p>
                </div>
              </div>
            </div>

            <div className={classes.genres}>
              {genres?.map((genre, i) => (
                <span key={i} className={classes.genre}>
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
    </article>
  );
};

export default LibraryItemCard;
