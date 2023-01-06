import { useEffect, useState } from "react";
import { useNavigate, useRouteError } from "react-router-dom";
import classes from "./Error.module.scss";

function ErrorPage() {
  const [count, setCount] = useState(10);
  const error = useRouteError();
  const navigate = useNavigate();

  document.title = `Watchably • Something Went Wrong`;

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      navigate("/discover");
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const errorTxt = `${error.status}: ${error.statusText}`;

  return (
    <div className={classes.container}>
      <h1>Something went wrong...</h1>
      <main id="error-content">
        <h2>{errorTxt}</h2>
        <p>You'll be redirected to /discover in {count}...</p>
      </main>
    </div>
  );
}

export default ErrorPage;
