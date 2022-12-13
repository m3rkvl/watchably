import { Fragment } from "react";
import { useRouteError } from "react-router-dom";

function ErrorPage() {
  const error = useRouteError();

  const errorTxt = `${error.status}: ${error.statusText}`;

  return (
    <Fragment>
      <h1>Navbar</h1>
      <main id="error-content">
        <h1>An error occurred!</h1>
        <p>{errorTxt}</p>
      </main>
    </Fragment>
  );
}

export default ErrorPage;
