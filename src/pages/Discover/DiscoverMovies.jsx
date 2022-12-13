import { useEffect, useState, useRef, Fragment } from "react";
import ExploreList from "../../components/Discover/ExploreList";
import { uniqueArray } from "../../util/uniqueArray";

import classes from "./DiscoverMovies.module.scss";

const DiscoverMovies = ({ query }) => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const list = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${query}?api_key=${process.env.REACT_APP_TMDB_KEY}&language=en-US&page=${page}`
      );

      if (!response.ok) {
        throw new Error({
          message: "Something went wrong while fetching data...",
        });
      }

      const data = await response.json();
      setMovies((prev) => {
        const unique = uniqueArray([...prev, ...data.results]);
        return unique;
      });
      setLoading(false);
    };

    fetchData();
  }, [page, query]);

  const handleScroll = () => {
    if (
      list.current.offsetHeight + list.current.scrollTop ===
      list.current.scrollHeight
    ) {
      setLoading(true);
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    const ref = list.current;
    list.current.addEventListener("scroll", handleScroll);

    return () => ref.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Fragment>
      <div className={classes.container}>
        <h1 className={classes.header}>
          Our {query.split("_").join(" ")} movies
        </h1>
        <div className={classes.shadowContainer}>
          <div className={classes.shadowTop}></div>
          <div className={classes.shadowBottom}></div>
          <div ref={list} className={classes.list}>
            <ExploreList items={movies} movie={true} />
          </div>
        </div>
        {loading && (
          <div className={classes.loading}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default DiscoverMovies;

/*
      <motion.div ref={carousel} className={classes.carousel}>
        <motion.div
          drag="y"
          dragConstraints={{ bottom: 0, top: -height }}
          className={classes.innerCarousel}
        >
          <div className={classes.list}>
            <ExploreList movies={movies} />
          </div>
        </motion.div>
      </motion.div>
*/
