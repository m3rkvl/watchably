import { Fragment, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { UserAuth } from "../../context/AuthContext";
import { getMovieDetails } from "../../util/api";
import movieDefPoster from "../../img/movie-poster-default.png";
import toHM from "../../util/toHM";

import classes from "./MovieDetail.module.scss";

const MovieDetail = () => {
  const {
    user,
    saveToWatchMovie,
    deleteToWatchMovie,
    saveWatchedMovie,
    deleteWatchedMovie,
    saveFavoriteMovie,
    deleteFavoriteMovie,
  } = UserAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && user !== "loading...") navigate("/auth", { replace: true });
  });

  const movie = useLoaderData();
  const [savedToWatch, setSavedToWatch] = useState(false);
  const [savedWatched, setSavedWatched] = useState(false);
  const [savedFavorite, setSavedFavorite] = useState(false);
  const [userRating, setUserRating] = useState("Not Rated");
  const state = useSelector((state) => state.auth.userData.movies);

  //prettier-ignore
  const posterPath = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : movieDefPoster;
  const genres = movie.genres?.map((genre) => genre.name);

  /////////////////////////////////////////////////////////////////////////
  //1/ HANDLERS

  const movieObj = {
    genre_ids: movie.genres || "??",
    id: movie.id || "??",
    media_type: "movie",
    overview: movie.overview || "??",
    popularity: movie.popularity || "??",
    poster_path: movie.poster_path || "??",
    release_date: movie.release_date || "????",
    title: movie.title || "??",
    vote_average: movie.vote_average || "??",
    vote_count: movie.vote_count || "??",
    listed_at: Date.now(),
  };

  const saveToWatchHandler = async () => {
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

  const saveWatchedHandler = async () => {
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

  const saveFavoriteHandler = async () => {
    if (savedToWatch) return;
    if (!savedWatched) return;
    if (savedWatched) {
      if (savedFavorite) await deleteFavoriteMovie(movieObj);
      if (!savedFavorite) await saveFavoriteMovie(movieObj);
    }
  };

  const userRatingHandler = async (e) => {
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

  useEffect(() => {
    setSavedToWatch(state.toWatch.some((e) => e.id === movie.id));
    setSavedWatched(state.watched.some((e) => e.id === movie.id));
    setSavedFavorite(state.favorites.some((e) => e.id === movie.id));
    setUserRating((prev) => {
      if (state.watched.find((e) => e.id === movie.id)) {
        console.log(state.watched.find((e) => e.id === movie.id).user_rating);
        return state.watched.find((e) => e.id === movie.id).user_rating;
      } else {
        return "Not Rated";
      }
    });
  }, [movie.id, state.toWatch, state.watched, state.favorites]);

  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.posterContainer}>
          {movie.poster_path ? (
            ""
          ) : (
            <h2 className={classes.noPosterTxt}>{movie.title}</h2>
          )}
          <img
            className={classes.poster}
            src={posterPath}
            alt={`${movie.title} Poster`}
          />
        </div>
        <div className={classes.info}>
          <h2 className={classes.title}>{movie.title}</h2>
          <div className={classes.underTitleContainer}>
            <div className={classes.underTitle}>
              <p className={classes.year}>{movie.release_date.split("-")[0]}</p>
              <p className={classes.runtime}>
                {movie.runtime ? toHM(movie.runtime) : "?h ??m"}
              </p>
              <p className={classes.lang}>
                {
                  movie?.spoken_languages?.find(
                    (lang) => lang.iso_639_1 === movie.original_language
                  )?.name
                }
              </p>
            </div>
            <div className={classes.votesContainer}>
              <div className={classes.votes}>
                <p className={classes.voteAvg}>{`${
                  movie.vote_average || movie.vote_average !== 0
                    ? movie.vote_average.toFixed(1)
                    : "?.?"
                }`}</p>
                <p className={classes.voteCount}>
                  {movie.vote_count === 0
                    ? "???"
                    : movie.vote_count.toLocaleString("en-US")}
                </p>
              </div>
            </div>
          </div>
          <div className={classes.genres}>
            {genres?.map((genre) => (
              <p key={genre} className={classes.genre}>
                {genre}
              </p>
            ))}
          </div>
          {movie.crew.length > 1 && (
            <Fragment>
              <div className={classes.castHeaderContainer}>
                <h2 className={classes.castHeader}>Crew</h2>
                <span className={classes.questionMark}>?</span>
                <span className={classes.hoverToSee}>
                  {" "}
                  Hover to see full names
                </span>
              </div>
              <ul className={classes.crew}>
                {movie.crew.map((member) => (
                  <li
                    key={member.id + member.job}
                    className={classes.crewMember}
                  >
                    <img
                      className={classes.crewProfile}
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                          : movieDefPoster
                      }
                      alt={`${member.name} profile.`}
                    />
                    <p className={classes.crewName}>{member.name}</p>
                    <p className={classes.crewJob}>{member.job}</p>
                  </li>
                ))}
              </ul>
            </Fragment>
          )}
          {movie.crew.length > 1 && (
            <Fragment>
              <div className={classes.castHeaderContainer}>
                <h2 className={classes.castHeader}>Cast</h2>
                <span className={classes.questionMark}>?</span>
                <span className={classes.hoverToSee}>
                  {" "}
                  Hover to see full names
                </span>
              </div>
              <ul className={classes.cast}>
                {movie.cast.map((member) => (
                  <li
                    key={member.id + member.character}
                    className={classes.castMember}
                  >
                    <img
                      className={classes.castProfile}
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                          : movieDefPoster
                      }
                      alt={`${member.name} profile.`}
                    />
                    <p className={classes.castName}>{member.name}</p>
                    <p className={classes.castJob}>{member.character}</p>
                  </li>
                ))}
              </ul>
            </Fragment>
          )}
          <p className={classes.tagline}>
            {movie.tagline ? movie.tagline : "Overview"}
          </p>
          <div lang="en" className={classes.overviewContainer}>
            <p className={classes.overview}>{movie.overview}</p>
          </div>
          <div className={classes.actions}>
            <button
              onClick={saveToWatchHandler}
              className={`${classes.btn} ${
                savedToWatch ? classes.activeToWatch : classes.toWatch
              }`}
            >
              <span>{savedToWatch ? `Don't Wanna Watch` : `Wanna Watch!`}</span>
            </button>

            <button
              onClick={saveWatchedHandler}
              className={`${classes.btn} ${
                savedWatched ? classes.activeWatched : classes.watched
              }`}
            >
              <span>{savedWatched ? `I Didn't Watch` : `I Watched`}</span>
            </button>

            <button
              disabled={savedToWatch || !savedWatched}
              onClick={saveFavoriteHandler}
              className={`${classes.btn} ${
                savedFavorite ? classes.activeFavorite : classes.favorite
              }`}
            >
              <span>{savedFavorite ? `Not My Favorite` : `My Favorite!`}</span>
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
        </div>
      </div>
    </Fragment>
  );
};

export default MovieDetail;

export async function loader({ params }) {
  return getMovieDetails(params.movieId);
}

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
