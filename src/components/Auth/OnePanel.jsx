import { Fragment, useState } from "react";
import LoginLayout from "./LoginLayout";
import classes from "./OnePanel.module.scss";
import SignupLayout from "./SignupLayout";

const OnePanel = () => {
  const [isLogin, setIsLogin] = useState(true);
  const switchTxt = isLogin ? "I don't have an account." : "I have an account.";

  const switchHandler = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <Fragment>
      <div className={classes.container}>
        {isLogin ? <LoginLayout /> : <SignupLayout />}
        <p onClick={switchHandler} className={classes.switchBtn}>
          {switchTxt}
        </p>
      </div>
    </Fragment>
  );
};

export default OnePanel;
