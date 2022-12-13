import { Fragment, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { UserAuth } from "../../context/AuthContext";
import { getSeriesDetails } from "../../util/api";
import seriesDefPoster from "../../img/series-poster-default.png";

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

  const series = useLoaderData();
  const [savedToWatch, setSavedToWatch] = useState(false);
  const [savedWatched, setSavedWatched] = useState(false);
  const [savedFavorite, setSavedFavorite] = useState(false);
  const [userRating, setUserRating] = useState("Not Rated");
  const state = useSelector((state) => state.auth.userData.series);

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
          {series.crew.length > 1 && (
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
          {series.cast.length > 1 && (
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

/*
{
    cast: [],
    crew: [],
    "adult": false,
    "backdrop_path": "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
    "created_by": [
        {
            "id": 1179419,
            "credit_id": "57599b0e925141378a002c87",
            "name": "Matt Duffer",
            "gender": 2,
            "profile_path": "/kXO5CnSxC0znMAICGxnPeuGP73U.jpg"
        },
        {
            "id": 1179422,
            "credit_id": "57599b039251410a99001cce",
            "name": "Ross Duffer",
            "gender": 2,
            "profile_path": "/kN1HdFViQkcJOQlNcvvFJIx9Uju.jpg"
        }
    ],
    "episode_run_time": [
        50
    ],
    "first_air_date": "2016-07-15",
    "genres": [
        {
            "id": 18,
            "name": "Drama"
        },
        {
            "id": 10765,
            "name": "Sci-Fi & Fantasy"
        },
        {
            "id": 9648,
            "name": "Mystery"
        }
    ],
    "homepage": "https://www.netflix.com/title/80057281",
    "id": 66732,
    "in_production": true,
    "languages": [
        "en"
    ],
    "last_air_date": "2022-07-01",
    "last_episode_to_air": {
        "air_date": "2022-07-01",
        "episode_number": 9,
        "id": 3325045,
        "name": "Chapter Nine: The Piggyback",
        "overview": "With selfless hearts and a clash of metal, heroes fight from every corner of the battlefield to save Hawkins — and the world itself.",
        "production_code": "",
        "runtime": 142,
        "season_number": 4,
        "show_id": 66732,
        "still_path": "/fvoa0Hosu4yK7TUiHglV8TvjMUB.jpg",
        "vote_average": 8.6,
        "vote_count": 100
    },
    "name": "Stranger Things",
    "networks": [
        {
            "id": 213,
            "name": "Netflix",
            "logo_path": "/wwemzKWzjKYJFfCeiB57q3r4Bcm.png",
            "origin_country": ""
        }
    ],
    "number_of_episodes": 34,
    "number_of_seasons": 4,
    "origin_country": [
        "US"
    ],
    "original_language": "en",
    "original_name": "Stranger Things",
    "overview": "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.",
    "popularity": 304.53,
    "poster_path": "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
    "production_countries": [
        {
            "iso_3166_1": "US",
            "name": "United States of America"
        }
    ],
    "seasons": [
        {
            "air_date": "2016-07-15",
            "episode_count": 8,
            "id": 77680,
            "name": "Season 1",
            "overview": "Strange things are afoot in Hawkins, Indiana, where a young boy's sudden disappearance unearths a young girl with otherworldly powers.",
            "poster_path": "/rbnuP7hlynAMLdqcQRCpZW9qDkV.jpg",
            "season_number": 1
        },
        {
            "air_date": "2017-10-27",
            "episode_count": 9,
            "id": 83248,
            "name": "Stranger Things 2",
            "overview": "It's been nearly a year since Will's strange disappearance. But life's hardly back to normal in Hawkins. Not even close.",
            "poster_path": "/lXS60geme1LlEob5Wgvj3KilClA.jpg",
            "season_number": 2
        },
        {
            "air_date": "2019-07-04",
            "episode_count": 8,
            "id": 115216,
            "name": "Stranger Things 3",
            "overview": "Budding romance. A brand-new mall. And rabid rats running toward danger. It's the summer of 1985 in Hawkins ... and one summer can change everything.",
            "poster_path": "/x2LSRK2Cm7MZhjluni1msVJ3wDF.jpg",
            "season_number": 3
        },
        {
            "air_date": "2022-05-28",
            "episode_count": 9,
            "id": 163313,
            "name": "Stranger Things 4",
            "overview": "Darkness returns to Hawkins just in time for spring break, igniting fresh terror, disturbing memories — and an ominous new threat.",
            "poster_path": "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
            "season_number": 4
        }
    ],
    "spoken_languages": [
        {
            "english_name": "English",
            "iso_639_1": "en",
            "name": "English"
        }
    ],
    "tagline": "Every ending has a beginning.",
    "vote_average": 8.643,
    "vote_count": 14508
}
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
