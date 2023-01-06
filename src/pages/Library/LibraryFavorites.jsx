import React from "react";
import { useSelector } from "react-redux";
import LibraryList from "../../components/Library/LibraryList";
import PanelsLayout from "../../UI/PanelsLayout";
import { uniqueArray } from "../../util/uniqueArray";

const LibraryFavorites = () => {
  const movies = useSelector((state) => state.auth.userData.movies);
  const series = useSelector((state) => state.auth.userData.series);

  //prettier-ignore
  const moviesFavorites = uniqueArray(movies.favorites.map(f => ({...f, toWatch: false, watched: true, favorite: true})).reverse());
  //prettier-ignore
  const seriesFavorites = uniqueArray(series.favorites.map(f => ({...f, toWatch: false, watched: true, favorite: true})).reverse());

  document.title = `Watchably • Favorites`;

  return (
    <PanelsLayout
      left={<LibraryList items={moviesFavorites} page="favorites" />}
      right={<LibraryList items={seriesFavorites} page="favorites" />}
      isOverflow={true}
    />
  );
};

export default LibraryFavorites;
