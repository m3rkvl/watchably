import classes from "./ExploreSeriesCard.module.scss";
import seriesDefPoster from "../../img/series-poster-default.png";
import getSeriesGenre from "../../util/getSeriesGenre";
import { Link } from "react-router-dom";
import ToWatchIcon from "../../icons/ToWatchIcon";
import WatchedIcon from "../../icons/WatchedIcon";
import FavoriteIcon from "../../icons/FavoriteIcon";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ExploreSeriesCard = ({ data, index, topRated }) => {
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
    <Link to={`/series/${data.id}`} className={classes.movieCard}>
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
  );
};

export default ExploreSeriesCard;
