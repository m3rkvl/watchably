import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isLoggingIn: true,
    page: 1,
    totalPages: 1,
    leftClicked: true,
    rightClicked: false,
  },
  reducers: {
    toggleIsLoggingIn(state) {
      state.isLoggingIn = !state.isLoggingIn;
    },

    firstPage(state) {
      state.page = 1;
    },

    nextPage(state) {
      state.page += 1;
    },

    prevPage(state) {
      state.page -= 1;
    },

    lastPage(state) {
      state.page = state.totalPages;
    },

    leftClick(state) {
      state.leftClicked = true;
      state.rightClicked = false;
    },

    rightClick(state) {
      state.leftClicked = false;
      state.rightClicked = true;
    },
  },
});

export const {
  toggleIsLoggingIn,
  firstPage,
  nextPage,
  prevPage,
  lastPage,
  leftClick,
  rightClick,
} = uiSlice.actions;

export default uiSlice;
