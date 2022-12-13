import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/index";
import App from "./App";

import { AuthContextProvider } from "./context/AuthContext";
import "./index.scss";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthContextProvider>
        <App />
      </AuthContextProvider>
    </Provider>
  </React.StrictMode>
);

// const isLogged = false;

/*
for auth...
<Navigate to="/dashboard" replace={true} />
*/
