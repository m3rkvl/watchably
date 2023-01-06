import React from "react";
import { useSelector } from "react-redux";
import LibraryList from "../../components/Library/LibraryList";
import PanelsLayout from "../../UI/PanelsLayout";
import { uniqueArray } from "../../util/uniqueArray";

const LibraryToWatch = () => {
  const movies = useSelector((state) => state.auth.userData.movies);
  const series = useSelector((state) => state.auth.userData.series);

  //prettier-ignore
  const moviesToWatch = uniqueArray(movies.toWatch.map((tw) => ({ ...tw, toWatch: true, watched: false, favorite: false, })).reverse());
  //prettier-ignore
  const seriesToWatch = uniqueArray(series.toWatch.map((tw) => ({ ...tw, toWatch: true, watched: false, favorite: false, })).reverse());

  document.title = `Watchably • To Watch`;

  return (
    <PanelsLayout
      left={<LibraryList items={moviesToWatch} page="toWatch" />}
      right={<LibraryList items={seriesToWatch} page="toWatch" />}
      isOverflow={true}
    />
  );
};

export default LibraryToWatch;
