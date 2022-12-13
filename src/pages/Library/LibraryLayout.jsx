import React, { Fragment, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { NavLink } from "react-router-dom";
import { UserAuth } from "../../context/AuthContext";
import classes from "./LibraryLayout.module.scss";
import MenuIcon from "../../icons/MenuIcon";

const LibraryLayout = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && user !== "loading...") navigate("/auth", { replace: true });
  });
  const [menuModalShown, setMenuModalShown] = useState(false);

  const inactiveMovies = `${classes.filterBtn} ${classes.movies}`;
  const activeMovies = `${classes.filterBtn} ${classes.activeMovies}`;
  const inactiveSeries = `${classes.filterBtn} ${classes.series}`;
  const activeSeries = `${classes.filterBtn} ${classes.activeSeries}`;

  const inactiveToWatch = `${classes.filterBtn} ${classes.toWatch}`;
  const activeToWatch = `${classes.filterBtn} ${classes.activeToWatch}`;
  const inactiveWatched = `${classes.filterBtn} ${classes.watched}`;
  const activeWatched = `${classes.filterBtn} ${classes.activeWatched}`;

  const inactiveFavorites = `${classes.filterBtn} ${classes.favorites}`;
  const activeFavorites = `${classes.filterBtn} ${classes.activeFavorites}`;
  const inactiveMain = `${classes.filterBtn} ${classes.main}`;
  const activeMain = `${classes.filterBtn} ${classes.activeMain}`;

  const menuShowHandler = () => {
    setMenuModalShown(true);
  };

  const menuHideHandler = () => {
    setMenuModalShown(false);
  };

  return (
    <Fragment>
      <button onClick={menuShowHandler} className={classes.menuBtn}>
        <span>
          <MenuIcon />
        </span>
      </button>
      <div
        className={`${classes.libraryLayout} ${
          menuModalShown && classes.modalVisible
        } ${classes.libraryLayout}`}
      >
        <NavLink
          onClick={menuHideHandler}
          to="/library"
          end
          //prettier-ignore
          className={({ isActive }) => isActive ? activeMain : inactiveMain}
          draggable="false"
        >
          <span>Main</span>
        </NavLink>
        <NavLink
          onClick={menuHideHandler}
          to="/library/movies"
          className={({ isActive }) =>
            isActive ? activeMovies : inactiveMovies
          }
          draggable="false"
        >
          <span>Movies</span>
        </NavLink>
        <NavLink
          onClick={menuHideHandler}
          to="/library/series"
          className={({ isActive }) =>
            isActive ? activeSeries : inactiveSeries
          }
          draggable="false"
        >
          <span>Series</span>
        </NavLink>
        <NavLink
          onClick={menuHideHandler}
          to="/library/toWatch"
          className={({ isActive }) =>
            isActive ? activeToWatch : inactiveToWatch
          }
          draggable="false"
        >
          <span>To Watch</span>
        </NavLink>
        <NavLink
          onClick={menuHideHandler}
          to="/library/watched"
          className={({ isActive }) =>
            isActive ? activeWatched : inactiveWatched
          }
          draggable="false"
        >
          <span>Watched</span>
        </NavLink>
        <NavLink
          onClick={menuHideHandler}
          to="/library/favorites"
          className={({ isActive }) =>
            isActive ? activeFavorites : inactiveFavorites
          }
          draggable="false"
          end
        >
          <span>Favorites</span>
        </NavLink>
      </div>
      <Outlet page="1" />
    </Fragment>
  );
};

export default LibraryLayout;
