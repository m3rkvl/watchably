import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { leftClick, rightClick } from "../store/ui-slice";
import classes from "./PanelsLayout.module.scss";

const PanelsLayout = ({ left, right, isAuthPage, isOverflow }) => {
  const state = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const [leftClicked, setLeftClicked] = useState(true);
  const [rightClicked, setRightClicked] = useState(false);
  //prettier-ignore
  const leftClasses = `${classes.panelCover} ${ state.leftClicked ? classes.hidden : "" }`;
  //prettier-ignore
  const rightClasses = `${classes.panelCover} ${ state.rightClicked ? classes.hidden : "" }`;

  const leftClickHandler = () => {
    dispatch(leftClick());
  };

  const rightClickHandler = () => {
    dispatch(rightClick());
  };

  return (
    <div className={classes.panelsContainer}>
      <div
        className={`${classes.panel} ${classes.leftPanel} ${
          isOverflow ? classes.overflowPanel : ""
        }`}
      >
        {isAuthPage && (
          <div onClick={leftClickHandler} className={leftClasses}>
            <span className={classes.leftCover}>Already have an account?</span>
          </div>
        )}
        {left}
      </div>
      <div
        className={`${classes.panel} ${classes.rightPanel} ${
          isOverflow ? classes.overflowPanel : ""
        }`}
      >
        {isAuthPage && (
          <div onClick={rightClickHandler} className={rightClasses}>
            <span className={classes.rightCover}>Don't have an account?</span>
          </div>
        )}
        {right}
      </div>
    </div>
  );
};

export default PanelsLayout;
