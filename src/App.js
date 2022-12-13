import React, { Fragment } from "react";
//prettier-ignore
import { createBrowserRouter,createRoutesFromElements,RouterProvider,Route, } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Error from "./pages/Error";

import SearchForm from "./pages/Search/SearchForm";
//prettier-ignore
import SearchResult, { loader as searchResultLoader, } from "./pages/Search/SearchResult";
import LibraryLayout from "./pages/Library/LibraryLayout";
import AuthPage from "./pages/AuthPage";

import LibraryMain from "./pages/Library/LibraryMain";
import LibraryMovies from "./pages/Library/LibraryMovies";
import LibrarySeries from "./pages/Library/LibrarySeries";
import LibraryToWatch from "./pages/Library/LibraryToWatch";
import LibraryWatched from "./pages/Library/LibraryWatched";
import LibraryFavorites from "./pages/Library/LibraryFavorites";

import MovieDetail from "./pages/Detail/MovieDetail";
import SeriesDetail from "./pages/Detail/SeriesDetail";
import { loader as movieLoader } from "./pages/Detail/MovieDetail";
import { loader as seriesLoader } from "./pages/Detail/SeriesDetail";

import RootLayout from "./pages/RootLayout";
import Homepage from "./pages/Homepage";

import DiscoverPageLayout from "./pages/Discover/DiscoverPageLayout";
import DiscoverMovies from "./pages/Discover/DiscoverMovies";
import DiscoverSeries from "./pages/Discover/DiscoverSeries";
import DiscoverPage from "./pages/Discover/DiscoverPage";

import MePage from "./pages/MePage";

import "./App.css";

const router = createBrowserRouter(
  createRoutesFromElements(
    //prettier-ignore
    <Route path="/" element={<RootLayout/>} errorElement={<Error/>}>
      <Route index element={<Homepage/>}/>
      <Route path="/auth" element={<AuthPage/>}/>
      <Route path="/me" element={<MePage/>}/>
      <Route path="/search" element={<SearchForm/>}/>
      <Route path="/search/:searchQuery" element={<SearchResult/>} loader={searchResultLoader}/>
      <Route path="/search/:searchQuery/:page" element={<SearchResult/>} loader={searchResultLoader}/>
      <Route path="/library" element={<LibraryLayout/>}>
        <Route index element={<LibraryMain/>}/>
        <Route path="movies" element={<LibraryMovies/>}/>
        <Route path="series" element={<LibrarySeries/>}/>
        <Route path="toWatch" element={<LibraryToWatch/>}/>
        <Route path="watched" element={<LibraryWatched/>}/>
        <Route path="favorites" element={<LibraryFavorites/>}/>
      </Route>
      <Route path="/discover" element={<DiscoverPageLayout/>}>
        <Route index element={<DiscoverPage/>}/>
        <Route path="popular/movies" element={<DiscoverMovies query="popular"/>}/>
        <Route path="popular/series" element={<DiscoverSeries query="popular"/>}/>
        <Route path="topRated/movies" element={<DiscoverMovies query="top_rated"/>}/>
        <Route path="topRated/series" element={<DiscoverSeries query="top_rated"/>}/>
      </Route>
      <Route path="/movies/:movieId" element={<MovieDetail/>} loader={movieLoader}/>
      <Route path="/series/:seriesId" element={<SeriesDetail/>} loader={seriesLoader}/>
    </Route>
  )
);

function App() {
  const darkMode = true;
  const root = document.documentElement;
  root.style.setProperty("--black", darkMode ? "#171717" : "#fafafa");

  return (
    <Fragment>
      <Toaster position="bottom-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </Fragment>
  );
}

export default App;
