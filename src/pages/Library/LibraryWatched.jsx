import React from "react";
import { useSelector } from "react-redux";
import LibraryList from "../../components/Library/LibraryList";
import PanelsLayout from "../../UI/PanelsLayout";
import { uniqueArray } from "../../util/uniqueArray";

const LibraryWatched = () => {
  const movies = useSelector((state) => state.auth.userData.movies);
  const series = useSelector((state) => state.auth.userData.series);

  //prettier-ignore
  const moviesWatched = movies.watched.filter((w) => movies.favorites.every((f) => f.id !== w.id)).map((w) => ({ ...w, toWatch: false, watched: true, favorite: false }));

  //prettier-ignore
  const moviesFavorites = movies.favorites.map(f => ({...f, toWatch: false, watched: true, favorite: true}));

  //prettier-ignore
  const seriesWatched = series.watched.filter((w) => series.favorites.every((f) => f.id !== w.id)).map((w) => ({ ...w, toWatch: false, watched: true, favorite: false }));

  //prettier-ignore
  const seriesFavorites = series.favorites.map(f => ({...f, toWatch: false, watched: true, favorite: true}));

  //prettier-ignore
  const moviesFinal = uniqueArray(moviesWatched.concat(moviesFavorites).reverse());
  //prettier-ignore
  const seriesFinal = uniqueArray(seriesWatched.concat(seriesFavorites).reverse());

  return (
    <PanelsLayout
      left={<LibraryList items={moviesFinal} page="watched" />}
      right={<LibraryList items={seriesFinal} page="watched" />}
      isOverflow={true}
    />
  );
};

export default LibraryWatched;
