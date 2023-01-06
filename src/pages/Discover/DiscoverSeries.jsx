import { useEffect, useState, useRef, Fragment } from "react";
import ExploreList from "../../components/Discover/ExploreList";
import { uniqueArray } from "../../util/uniqueArray";

import classes from "./DiscoverSeries.module.scss";

const DiscoverSeries = ({ query }) => {
  const [series, setSeries] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const list = useRef();

  document.title = `Watchably • Discover Series`;

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `https://api.themoviedb.org/3/tv/${query}?api_key=caf2c01855c455cdaa421e41ce07fa14&language=en-US&page=${page}`
      );

      if (!response.ok) {
        throw new Error({
          message: "Something went wrong while fetching data...",
        });
      }

      const data = await response.json();
      setSeries((prev) => {
        const unique = uniqueArray([...prev, ...data.results]);
        return unique;
      });
      setLoading(false);
    };

    fetchData();
  }, [query, page]);

  const handleScroll = () => {
    if (
      list.current.offsetHeight + list.current.scrollTop + 1 >=
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
          Our {query.split("_").join(" ")} series
        </h1>
        <div className={classes.shadowContainer}>
          <div className={classes.shadowTop}></div>
          <div className={classes.shadowBottom}></div>
          <div ref={list} className={classes.list}>
            <ExploreList items={series} />
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

export default DiscoverSeries;

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
