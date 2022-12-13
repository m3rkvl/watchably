import React from "react";
import { useSelector } from "react-redux";
import LibraryList from "../../components/Library/LibraryList";
import PanelsLayout from "../../UI/PanelsLayout";
import { uniqueArray } from "../../util/uniqueArray";

const LibrarySeries = () => {
  const series = useSelector((state) => state.auth.userData.series);

  //prettier-ignore
  const seriesWatched = series.watched.filter((w) => series.favorites.every((f) => f.id !== w.id)).map((w) => ({ ...w, toWatch: false, watched: true, favorite: false }));
  //prettier-ignore
  const seriesFavorites = series.favorites.map(f => ({...f, toWatch: false, watched: true, favorite: true}));

  //prettier-ignore
  const seriesToWatchFinal = uniqueArray(series.toWatch.map(tw => ({...tw, toWatch: true, watched: false, favorite: false})));
  //prettier-ignore
  const seriesWatchedFinal = uniqueArray(seriesWatched.concat(seriesFavorites).reverse());

  return (
    <PanelsLayout
      left={<LibraryList items={seriesToWatchFinal} page="series" />}
      right={<LibraryList items={seriesWatchedFinal} page="series" />}
      isOverflow={true}
    />
  );
};

export default LibrarySeries;
