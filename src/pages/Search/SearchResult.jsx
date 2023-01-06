import React, { Fragment, useEffect, useState } from "react";
import { useLoaderData, useNavigate, useParams } from "react-router";
import SearchList from "../../components/Search/SearchList";
import { UserAuth } from "../../context/AuthContext";
import PanelsLayout from "../../UI/PanelsLayout";
import { getSearchResults } from "../../util/api";
import PrevIcon from "../../icons/PrevIcon";
import NextIcon from "../../icons/NextIcon";

import classes from "./SearchResult.module.scss";

const SearchResult = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  const results = useLoaderData();
  const { searchQuery } = useParams();
  const [pageState, setPageState] = useState(results?.page);
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const searchQueryTxt = searchQuery.includes("%20")
    ? searchQuery.split("%20").join(" ")
    : searchQuery;

  const prevHandler = async () => {
    if (pageState === 1) return;
    setPageState((prevPage) => prevPage - 1);
  };

  const nextHandler = () => {
    if (pageState === results?.total_pages) return;
    setPageState((prevPage) => prevPage + 1);
  };

  const lastHandler = () => {
    setPageState(results?.total_pages);
  };

  const firstHandler = () => {
    setPageState(1);
  };

  document.title = `Watchably • ${searchQuery}`;

  useEffect(() => {
    if (!user && user !== "loading...") {
      navigate("/auth", { replace: true });
    } else {
      setMovies(
        results.results.filter((result) => result.media_type === "movie")
      );
      setSeries(results.results.filter((result) => result.media_type === "tv"));
      navigate(`/search/${searchQuery}/${pageState}`);
    }
  }, [navigate, searchQuery, pageState, user]);

  return (
    <Fragment>
      <div className={classes.pagination}>
        <p className={classes.searchQueryTxt}>{searchQueryTxt}</p>
        <button
          disabled={pageState === 1 ? true : false}
          className={`${classes.btn}`}
          onClick={firstHandler}
        >
          1
        </button>
        <button
          disabled={pageState === 1 ? true : false}
          className={`${classes.btn}`}
          onClick={prevHandler}
        >
          <span>
            <PrevIcon />
          </span>
        </button>
        <p className={classes.currentPage}>{pageState}</p>
        <button
          disabled={pageState === results?.total_pages ? true : false}
          className={`${classes.btn}`}
          onClick={nextHandler}
        >
          <span>
            <NextIcon />
          </span>
        </button>
        <button
          disabled={pageState === results?.total_pages ? true : false}
          className={`${classes.btn}`}
          onClick={lastHandler}
        >
          {results?.total_pages}
        </button>
      </div>
      <PanelsLayout
        left={<SearchList searchResults={movies} />}
        right={<SearchList searchResults={series} />}
        isOverflow={true}
      />
    </Fragment>
  );
};

export default SearchResult;

export async function loader({ params }) {
  return getSearchResults(params.searchQuery, params.page ?? 1);
}
