import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import classes from "./SearchForm.module.scss";

const SearchForm = () => {
  const { user, saveSearch } = UserAuth();
  const searchesState = useSelector((state) => state.auth.userData.searches);
  let searches;
  //prettier-ignore
  if (searchesState?.length > 0) searches = [...searchesState]?.sort((a, b) => b.date - a.date);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && user !== "loading...") navigate("/auth", { replace: true });
  });

  document.title = `Watchably • Search`;

  const [query, setQuery] = useState("");

  const inputHandler = (e) => {
    setQuery(e.target.value);
  };

  const searchSubmitHandler = async (e) => {
    e.preventDefault();
    if (query === "") return;

    try {
      await saveSearch({ query, date: Date.now() });
      const queryTo = query
        .split(" ")
        .filter((word) => word !== "")
        .join("%20");

      navigate(`/search/${queryTo}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.container}>
      <form className={classes.searchForm} onSubmit={searchSubmitHandler}>
        <div className={classes.fieldHolder}>
          <input
            className={classes.searchInput}
            onChange={inputHandler}
            type="text"
            id="search"
            placeholder=" "
            autoComplete="off"
          />
          <label htmlFor="search" className={classes.searchLabel}>
            Search a movie or a series name...
          </label>
        </div>
        <button className={classes.searchSubmit} type="submit">
          <span>Search</span>
        </button>
      </form>
      {searchesState?.length > 0 && (
        <div className={classes.searchesContainer}>
          <h2 className={classes.searchesTitle}>Your last 5 searches</h2>
          <ul className={classes.searchesList}>
            {searches.map((search) => (
              <li key={search.date}>
                <Link
                  to={`/search/${search.query
                    .split(" ")
                    .filter((word) => word !== "")
                    .join("%20")}`}
                  className={classes.searchesItem}
                >
                  {search.query}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
