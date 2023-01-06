import React from "react";
import { useSelector } from "react-redux";
import LibraryList from "../../components/Library/LibraryList";
import PanelsLayout from "../../UI/PanelsLayout";
import { uniqueArray } from "../../util/uniqueArray";

const LibraryMovies = () => {
  const movies = useSelector((state) => state.auth.userData.movies);

  //prettier-ignore
  const moviesWatched = movies.watched.filter((w) => movies.favorites.every((f) => f.id !== w.id)).map((w) => ({ ...w, toWatch: false, watched: true, favorite: false }));
  //prettier-ignore
  const moviesFavorites = movies.favorites.map(f => ({...f, toWatch: false, watched: true, favorite: true}));

  //prettier-ignore
  const moviesToWatchFinal = uniqueArray(movies.toWatch.map(tw => ({...tw, toWatch: true, watched: false, favorite: false})));
  //prettier-ignore
  const moviesWatchedFinal = uniqueArray(moviesWatched.concat(moviesFavorites).reverse());

  document.title = `Watchably • Movies Saved`;

  return (
    <PanelsLayout
      left={<LibraryList items={moviesToWatchFinal} page="movies" />}
      right={<LibraryList items={moviesWatchedFinal} page="movies" />}
      isOverflow={true}
    />
  );
};

export default LibraryMovies;
