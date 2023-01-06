import { Fragment, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { UserAuth } from "../../context/AuthContext";
import { getSeriesDetails } from "../../util/api";
import seriesDefPoster from "../../img/series-poster-default.png";
import { useMediaQuery } from "react-responsive";

import classes from "./SeriesDetail.module.scss";

const SeriesDetail = () => {
  const {
    user,
    saveToWatchSeries,
    deleteToWatchSeries,
    saveWatchedSeries,
    deleteWatchedSeries,
    saveFavoriteSeries,
    deleteFavoriteSeries,
  } = UserAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && user !== "loading...") navigate("/auth", { replace: true });
  });

  const phone = useMediaQuery({
    query: "(max-width: 21.25rem)",
  });

  const series = useLoaderData();
  const [savedToWatch, setSavedToWatch] = useState(false);
  const [savedWatched, setSavedWatched] = useState(false);
  const [savedFavorite, setSavedFavorite] = useState(false);
  const [userRating, setUserRating] = useState("Not Rated");
  const state = useSelector((state) => state.auth.userData.series);

  document.title = `Watchably • ${series.name}`;

  const posterPath = series.poster_path
    ? `https://image.tmdb.org/t/p/w500${series.poster_path}`
    : seriesDefPoster;
  const genres = series.genres?.map((genre) => genre.name);
  //prettier-ignore
  const seasons = series.number_of_seasons ? `${series.number_of_seasons} Season${series.number_of_seasons > 1 ? "s" : ""}` : "";
  //prettier-ignore
  const episodes = series.number_of_episodes ? `${series.number_of_episodes} Episode${series.number_of_episodes > 1 ? "s" : ""}` : "";
  //prettier-ignore
  const minutes = series.episode_run_time ? `${series.episode_run_time}m` : "";

  const seriesObj = {
    genre_ids: series.genres || "??",
    id: series.id || "??",
    media_type: "tv",
    overview: series.overview || "??",
    popularity: series.popularity || "??",
    poster_path: series.poster_path || "??",
    first_air_date: series.first_air_date || "????",
    name: series.name || "??",
    vote_average: series.vote_average || "??",
    vote_count: series.vote_count || "??",
    listed_at: Date.now(),
  };

  const saveToWatchHandler = async () => {
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

  const saveWatchedHandler = async () => {
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

  const saveFavoriteHandler = async () => {
    if (savedToWatch) return;
    if (!savedWatched) return;
    if (savedWatched) {
      if (savedFavorite) await deleteFavoriteSeries(seriesObj);
      if (!savedFavorite) await saveFavoriteSeries(seriesObj);
    }
  };

  const userRatingHandler = async (e) => {
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
    setSavedToWatch(state.toWatch.some((e) => e.id === series.id));
    setSavedWatched(state.watched.some((e) => e.id === series.id));
    setSavedFavorite(state.favorites.some((e) => e.id === series.id));
    setUserRating((prev) => {
      if (state.watched.find((e) => e.id === series.id)) {
        return state.watched.find((e) => e.id === series.id).user_rating;
      } else {
        return "Not Rated";
      }
    });
  }, [series.id, state.toWatch, state.watched, state.favorites]);

  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.posterContainer}>
          {series.poster_path ? (
            ""
          ) : (
            <h2 className={classes.noPosterTxt}>{series.title}</h2>
          )}
          <img
            className={classes.poster}
            src={posterPath}
            alt={`${series.title} Poster`}
          />
        </div>
        <div className={classes.info}>
          <h2 className={classes.title}>{series.name}</h2>
          <div className={classes.underTitleContainer}>
            <div className={classes.underTitle}>
              <p className={classes.year}>
                {series.first_air_date.split("-")[0]}
              </p>
              <p className={classes.runtime}>
                {`${seasons} ${episodes}`} <span>{`(${minutes})`}</span>
              </p>
              <p className={classes.lang}>
                {
                  series?.spoken_languages?.find(
                    (lang) => lang.iso_639_1 === series.original_language
                  )?.name
                }
              </p>
            </div>
            <div className={classes.votesContainer}>
              <div className={classes.votes}>
                <p className={classes.voteAvg}>{`${
                  series.vote_average || series.vote_average !== 0
                    ? series.vote_average.toFixed(1)
                    : "?.?"
                }`}</p>
                <p className={classes.voteCount}>
                  {series.vote_count === 0
                    ? "???"
                    : series.vote_count.toLocaleString("en-US")}
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
          {phone && (
            <div className={classes.phoneCrewCastContainer}>
              {phone && series.crew.length > 1 && (
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
                    {series.crew.map((member) => (
                      <li
                        key={member.id + member.job}
                        className={classes.crewMember}
                      >
                        <img
                          className={classes.crewProfile}
                          src={
                            member.profile_path
                              ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                              : seriesDefPoster
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
              {phone && series.crew.length > 1 && (
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
                    {series.cast.map((member) => (
                      <li
                        key={member.id + member.character}
                        className={classes.castMember}
                      >
                        <img
                          className={classes.castProfile}
                          src={
                            member.profile_path
                              ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                              : seriesDefPoster
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
            </div>
          )}
          {!phone && series.crew.length > 1 && (
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
                {series.crew.map((member) => (
                  <li
                    key={member.id + member.job}
                    className={classes.crewMember}
                  >
                    <img
                      className={classes.crewProfile}
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                          : seriesDefPoster
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
          {!phone && series.cast.length > 1 && (
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
                {series.cast.map((member) => (
                  <li
                    key={member.id + member.character}
                    className={classes.castMember}
                  >
                    <img
                      className={classes.castProfile}
                      src={
                        member.profile_path
                          ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
                          : seriesDefPoster
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
            {series.tagline ? series.tagline : "Overview"}
          </p>
          <div lang="en" className={classes.overviewContainer}>
            <p className={classes.overview}>{series.overview}</p>
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
                disabled={!savedWatched}
                value={userRating}
                onChange={userRatingHandler}
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

export default SeriesDetail;

export async function loader({ params }) {
  return getSeriesDetails(params.seriesId);
}
