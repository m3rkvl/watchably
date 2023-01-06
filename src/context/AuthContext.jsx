import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  updateEmail,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import toast from "react-hot-toast";

import {
  arrayUnion,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  deleteUserDataMoviesFavorites,
  deleteUserDataMoviesToWatch,
  deleteUserDataMoviesWatched,
  deleteUserDataSeriesFavorites,
  deleteUserDataSeriesToWatch,
  deleteUserDataSeriesWatched,
  getUserData,
  setUserDataMoviesFavorites,
  setUserDataMoviesToWatch,
  setUserDataMoviesWatched,
  setUserDataSeriesFavorites,
  setUserDataSeriesToWatch,
  setUserDataSeriesWatched,
} from "../store/auth-slice";
import { useDispatch, useSelector } from "react-redux";
import { leftClick, rightClick } from "../store/ui-slice";

const UserContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState("loading...");
  const dispatch = useDispatch();
  const moviesState = useSelector((state) => state.auth.userData.movies);
  const seriesState = useSelector((state) => state.auth.userData.series);
  const searchesState = useSelector((state) => state.auth.userData.searches);

  const signUp = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(
        doc(db, "users", email),
        {
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
        { merge: true }
      );
      toast.success("You're signed up!");
    } catch (err) {
      toast.error(err.message);
    }
  };
  const signIn = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      dispatch(leftClick());
      toast.success("You're logged in!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      toast.success("You're logged out!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Your password reset email sent!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateUserProfile = async (data) => {
    try {
      await updateProfile(auth.currentUser, data);
      toast.success("Your profile updated!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateUserEmail = async (email, password) => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );
      const oldEmail = auth.currentUser.email;
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, email);
      const docSnap = await getDoc(doc(db, "users", `${oldEmail}`));
      await setDoc(doc(db, "users", email), docSnap.data());
      setTimeout(async () => {
        await deleteDoc(doc(db, "users", `${oldEmail}`));
      }, 1000);
      window.location.reload(false);
      toast.success("Your email is updated!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateUserPassword = async (password, currentPassword) => {
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, password);
      toast.success("Your password is updated!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  //////////////////////////////////////////////////////////////////////////////

  const dataPath = doc(db, "users", `${user?.email}`);

  const saveSearch = async (searchObj) => {
    console.log(searchesState);
    //prettier-ignore
    const uniqueArr = await searchesState.filter((curObj) => curObj.query !== searchObj.query);
    if (uniqueArr.length === 5) uniqueArr.shift();
    await uniqueArr.push(searchObj);
    console.log(uniqueArr);
    //prettier-ignore
    await updateDoc(dataPath, { searches: uniqueArr });
    dispatch(setUserDataMoviesWatched(uniqueArr));
  };

  //1/ MOVIE FUNCTIONS //////////////////////////////////////////////////////////////
  //2/ ---- ToWatch ----
  //3/ save
  const saveToWatchMovie = async (movieObj) => {
    //prettier-ignore
    await updateDoc(dataPath, { "movies.toWatch": arrayUnion(movieObj) });
    dispatch(setUserDataMoviesToWatch(movieObj));
  };
  //3/ delete
  const deleteToWatchMovie = async (movieObj) => {
    const deletedToWatch = moviesState.toWatch.filter(
      (e) => e.id !== movieObj.id
    );
    //prettier-ignore
    await updateDoc(dataPath, { "movies.toWatch": deletedToWatch, });
    dispatch(deleteUserDataMoviesToWatch(deletedToWatch));
  };

  //2/ ---- Watched ----
  //3/ save
  const saveWatchedMovie = async (movieObj) => {
    //prettier-ignore
    await updateDoc(dataPath, { "movies.watched": arrayUnion(movieObj) });
    dispatch(setUserDataMoviesWatched(movieObj));
  };
  //3/ delete
  const deleteWatchedMovie = async (movieObj) => {
    const deletedWatched = moviesState.watched.filter(
      (e) => e.id !== movieObj.id
    );
    //prettier-ignore
    await updateDoc(dataPath, { "movies.watched": deletedWatched, });
    dispatch(deleteUserDataMoviesWatched(deletedWatched));
  };

  //2/ ---- Favorite ----
  //3/ save
  const saveFavoriteMovie = async (movieObj) => {
    //prettier-ignore
    await updateDoc(dataPath, { "movies.favorites": arrayUnion(movieObj) });
    dispatch(setUserDataMoviesFavorites(movieObj));
  };
  //3/ delete
  const deleteFavoriteMovie = async (movieObj) => {
    const deletedFavorites = moviesState.favorites.filter(
      (e) => e.id !== movieObj.id
    );
    //prettier-ignore
    await updateDoc(dataPath, { "movies.favorites": deletedFavorites, });
    dispatch(deleteUserDataMoviesFavorites(deletedFavorites));
  };

  //1/ SERIES FUNCTIONS //////////////////////////////////////////////////////////////
  //2/ ---- ToWatch ----
  //3/ save
  const saveToWatchSeries = async (seriesObj) => {
    //prettier-ignore
    await updateDoc(dataPath, { "series.toWatch": arrayUnion(seriesObj) });
    dispatch(setUserDataSeriesToWatch(seriesObj));
  };
  //3/ delete
  const deleteToWatchSeries = async (seriesObj) => {
    const deletedToWatch = seriesState.toWatch.filter(
      (e) => e.id !== seriesObj.id
    );
    //prettier-ignore
    await updateDoc(dataPath, { "series.toWatch": deletedToWatch, });
    dispatch(deleteUserDataSeriesToWatch(deletedToWatch));
  };

  //2/ ---- Watched ----
  //3/ save
  const saveWatchedSeries = async (seriesObj) => {
    //prettier-ignore
    await updateDoc(dataPath, { "series.watched": arrayUnion(seriesObj) });
    dispatch(setUserDataSeriesWatched(seriesObj));
  };
  //3/ delete
  const deleteWatchedSeries = async (seriesObj) => {
    const deletedWatched = seriesState.watched.filter(
      (e) => e.id !== seriesObj.id
    );
    //prettier-ignore
    await updateDoc(dataPath, { "series.watched": deletedWatched, });
    dispatch(deleteUserDataSeriesWatched(deletedWatched));
  };

  //2/ ---- Favorite ----
  //3/ save
  const saveFavoriteSeries = async (seriesObj) => {
    //prettier-ignore
    await updateDoc(dataPath, { "series.favorites": arrayUnion(seriesObj) });
    dispatch(setUserDataSeriesFavorites(seriesObj));
  };
  //3/ delete
  const deleteFavoriteSeries = async (seriesObj) => {
    const deletedFavorites = seriesState.favorites.filter(
      (e) => e.id !== seriesObj.id
    );
    //prettier-ignore
    await updateDoc(dataPath, { "series.favorites": deletedFavorites, });
    dispatch(deleteUserDataSeriesFavorites(deletedFavorites));
  };

  //////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser((prevUser) => currentUser);
        onSnapshot(doc(db, "users", `${currentUser.email}`), (doc) => {
          dispatch(getUserData(doc.data()));
        });
      } else {
        setUser(null);
        dispatch(
          getUserData({
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
          })
        );
      }
    });
    return () => {
      unsubscribe();
    };
  }, [dispatch]);

  return (
    <UserContext.Provider
      value={{
        signUp,
        signIn,
        logOut,
        resetPassword,
        updateUserProfile,
        updateUserEmail,
        updateUserPassword,
        user,
        saveSearch,
        saveToWatchMovie,
        deleteToWatchMovie,
        saveWatchedMovie,
        deleteWatchedMovie,
        saveFavoriteMovie,
        deleteFavoriteMovie,
        saveToWatchSeries,
        deleteToWatchSeries,
        saveWatchedSeries,
        deleteWatchedSeries,
        saveFavoriteSeries,
        deleteFavoriteSeries,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
