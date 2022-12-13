import classes from "./NavBtn.module.scss";
import { NavLink } from "react-router-dom";

import SearchIcon from "../../../icons/SearchIcon";
import LibraryIcon from "../../../icons/LibraryIcon";

const NavBtn = (props) => {
  const icon = props.role === "search" ? <SearchIcon /> : <LibraryIcon />;
  //prettier-ignore
  const inactiveClass = `${classes.NavBtn} ${props.role === "search" ? classes.search : classes.library}`;
  const activeClass = `${inactiveClass} ${classes.active} ${
    props.role === "search" ? classes.activeSearch : classes.activeLibrary
  }`;

  return (
    <NavLink
      aria-label={`navigate to "/${props.role}" page`}
      to={`/${props.role}`}
      className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
      draggable="false"
    >
      {icon}
    </NavLink>
  );
};

export default NavBtn;
