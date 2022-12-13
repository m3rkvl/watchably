import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userData: {
      movies: {
        toWatch: [],
        watched: [],
        favorites: [],
      },
      series: {
        toWatch: [],
        watched: [],
        favorites: [],
      },
      searches: [],
    },
  },
  reducers: {
    // INIT
    getUserData(state, { payload }) {
      state.userData = {};
      state.userData = payload;
    },

    setUserDataSearches(state, { payload }) {
      state.userData.searches = payload;
    },

    // SET/UPDATE
    setUserDataMoviesToWatch(state, { payload }) {
      state.userData.movies.toWatch.push(payload);
    },

    setUserDataMoviesWatched(state, { payload }) {
      state.userData.movies.watched.push(payload);
    },

    setUserDataMoviesFavorites(state, { payload }) {
      state.userData.movies.favorites.push(payload);
    },

    setUserDataSeriesToWatch(state, { payload }) {
      state.userData.series.toWatch.push(payload);
    },

    setUserDataSeriesWatched(state, { payload }) {
      state.userData.series.watched.push(payload);
    },

    setUserDataSeriesFavorites(state, { payload }) {
      state.userData.series.favorites.push(payload);
    },

    // DELETE (firebase doesnt support deleting i guess, so we completely change the array in both ends.)
    deleteUserDataMoviesToWatch(state, { payload }) {
      state.userData.movies.toWatch = payload;
    },

    deleteUserDataMoviesWatched(state, { payload }) {
      state.userData.movies.watched = payload;
    },

    deleteUserDataMoviesFavorites(state, { payload }) {
      state.userData.movies.favorites = payload;
    },

    deleteUserDataSeriesToWatch(state, { payload }) {
      state.userData.series.toWatch = payload;
    },

    deleteUserDataSeriesWatched(state, { payload }) {
      state.userData.series.watched = payload;
    },

    deleteUserDataSeriesFavorites(state, { payload }) {
      state.userData.series.favorites = payload;
    },
  },
});

export const {
  getUserData,
  setUserDataMoviesToWatch,
  setUserDataMoviesWatched,
  setUserDataMoviesFavorites,
  setUserDataSeriesToWatch,
  setUserDataSeriesWatched,
  setUserDataSeriesFavorites,
  deleteUserDataMoviesToWatch,
  deleteUserDataMoviesWatched,
  deleteUserDataMoviesFavorites,
  deleteUserDataSeriesToWatch,
  deleteUserDataSeriesWatched,
  deleteUserDataSeriesFavorites,
} = authSlice.actions;

export default authSlice;
