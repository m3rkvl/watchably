import classes from "./ExploreSeriesCard.module.scss";
import seriesDefPoster from "../../img/series-poster-default.png";
import getSeriesGenre from "../../util/getSeriesGenre";
import { Link } from "react-router-dom";
import ToWatchIcon from "../../icons/ToWatchIcon";
import WatchedIcon from "../../icons/WatchedIcon";
import FavoriteIcon from "../../icons/FavoriteIcon";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserAuth } from "../../context/AuthContext";

const ExploreSeriesCard = ({ data, index, topRated }) => {
  const {
    user,
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
  const seriesState = useSelector((state) => state.auth.userData.series);

  //prettier-ignore
  const isToWatchActive = savedToWatch ? classes.toWatchActive : classes.toWatchInactive;
  //prettier-ignore
  const isWatchedActive = savedWatched ? classes.watchedActive : classes.watchedInactive;
  //prettier-ignore
  const isFavoriteActive = savedFavorite ? classes.favoriteActive : classes.favoriteInactive;

  //prettier-ignore
  const defPoster = seriesDefPoster;
  //prettier-ignore
  const posterPath = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : defPoster;
  //prettier-ignore
  const coverClass = `${classes.cardCover} ${classes.seriesCover}`;
  //prettier-ignore
  const genres = data.genre_ids?.map(genre => getSeriesGenre(genre));
  //prettier-ignore
  const year = data?.first_air_date?.split("-")[0]
  //prettier-ignore
  const voteClass = classes.voteSeries;

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

  const saveToWatchHandler = async (e) => {
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

  const saveWatchedHandler = async (e) => {
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
  const saveFavoriteHandler = async (e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    if (savedToWatch) return;
    if (!savedWatched) return;
    if (savedWatched) {
      if (savedFavorite) await deleteFavoriteSeries(seriesObj);
      if (!savedFavorite) await saveFavoriteSeries(seriesObj);
    }
  };

  const userRatingHandler = async (e) => {
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

  useEffect(() => {
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
  }, [
    data.id,
    data.media_type,
    seriesState.toWatch,
    seriesState.watched,
    seriesState.favorites,
  ]);

  return (
    <div className={classes.movieCardContainer}>
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

      <Link to={`/series/${data.id}`} className={classes.movieCard}>
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
                <h2 className={classes.title}>{data.name}</h2>
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
    </div>
  );
};

export default ExploreSeriesCard;
