import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./DiscoverPage.module.scss";

const DiscoverPage = () => {
  const [imgPopMov, setImgPopMov] = useState("");
  const [imgPopSer, setImgPopSer] = useState("");
  const [imgTopMov, setImgTopMov] = useState("");
  const [imgTopSer, setImgTopSer] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const responsePopMov = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
      );
      const responsePopSer = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
      );
      const responseTopMov = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
      );
      const responseTopSer = await fetch(
        `https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=1`
      );

      if (
        !responsePopMov.ok ||
        !responsePopSer.ok ||
        !responseTopMov.ok ||
        !responseTopSer.ok
      ) {
        throw new Error({
          message: "Something went wrong while fetching data...",
        });
      }

      const dataPopMov = await responsePopMov.json();
      const dataPopSer = await responsePopSer.json();
      const dataTopMov = await responseTopMov.json();
      const dataTopSer = await responseTopSer.json();

      setImgPopMov(dataPopMov.results[0].backdrop_path);
      setImgPopSer(dataPopSer.results[0].backdrop_path);
      setImgTopMov(dataTopMov.results[0].backdrop_path);
      setImgTopSer(dataTopSer.results[0].backdrop_path);
    };

    fetchData();
  }, []);

  return (
    <div className={classes.container}>
      <Link to="/discover/popular/movies">
        <div className={classes.link}>
          <div className={`${classes.cover} ${classes.discoverMovies}`}>
            <span>Popular Movies</span>
          </div>
          <img
            className={classes.background}
            src={`https://image.tmdb.org/t/p/w500${imgPopMov}`}
            alt="background for popular movies link"
          />
        </div>
      </Link>
      <Link to="/discover/popular/series">
        <div className={classes.link}>
          <div className={`${classes.cover} ${classes.discoverSeries}`}>
            <span>Popular Series</span>
          </div>
          <img
            className={classes.background}
            src={`https://image.tmdb.org/t/p/w500${imgPopSer}`}
            alt="background for popular series link"
          />
        </div>
      </Link>
      <Link to="/discover/topRated/movies">
        <div className={classes.link}>
          <div className={`${classes.cover} ${classes.topRatedMovies}`}>
            <span>Top Rated Movies</span>
          </div>
          <img
            className={classes.background}
            src={`https://image.tmdb.org/t/p/w500${imgTopMov}`}
            alt="background for top rated movies link"
          />
        </div>
      </Link>
      <Link to="/discover/topRated/series">
        <div className={classes.link}>
          <div className={`${classes.cover} ${classes.topRatedSeries}`}>
            <span>Top Rated Series</span>
          </div>
          <img
            className={classes.background}
            src={`https://image.tmdb.org/t/p/w500${imgTopSer}`}
            alt="background for top rated series link"
          />
        </div>
      </Link>
    </div>
  );
};

export default DiscoverPage;
