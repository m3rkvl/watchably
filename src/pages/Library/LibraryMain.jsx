import React from "react";
import { useSelector } from "react-redux";
import LibraryList from "../../components/Library/LibraryList";
import PanelsLayout from "../../UI/PanelsLayout";
import { uniqueArray } from "../../util/uniqueArray";

const LibraryMain = () => {
  const movies = useSelector((state) => state.auth.userData.movies);
  const series = useSelector((state) => state.auth.userData.series);

  //prettier-ignore
  const moviesWatched = movies.watched.filter((w) => movies.favorites.every((f) => f.id !== w.id)).map((w) => ({ ...w, toWatch: false, watched: true, favorite: false }));
  //prettier-ignore
  const moviesToWatch = movies.toWatch.map(tw => ({...tw, toWatch: true, watched: false, favorite: false}));
  //prettier-ignore
  const moviesFavorites = movies.favorites.map(f => ({...f, toWatch: false, watched: true, favorite: true}));

  console.log(moviesWatched);

  //prettier-ignore
  const seriesWatched = series.watched.filter((w) => series.favorites.every((f) => f.id !== w.id)).map((w) => ({ ...w, toWatch: false, watched: true, favorite: false }));
  //prettier-ignore
  const seriesToWatch = series.toWatch.map(tw => ({...tw, toWatch: true, watched: false, favorite: false}));
  //prettier-ignore
  const seriesFavorites = series.favorites.map(f => ({...f, toWatch: false, watched: true, favorite: true}));

  //prettier-ignore
  const moviesFinal = uniqueArray(moviesWatched.concat(moviesFavorites, moviesToWatch).reverse());
  //prettier-ignore
  const seriesFinal = uniqueArray(seriesWatched.concat(seriesFavorites, seriesToWatch).reverse());
  // const seriesFinal = uniqueArray(seriesWatched.concat(seriesFavorites, seriesToWatch).sort((a,b) => b.listed_at - a.listed_at));

  document.title = `Watchably • Library`;

  return (
    <PanelsLayout
      left={<LibraryList items={moviesFinal} page="main" />}
      right={<LibraryList items={seriesFinal} page="main" />}
      isOverflow={true}
    />
  );
};

export default LibraryMain;
