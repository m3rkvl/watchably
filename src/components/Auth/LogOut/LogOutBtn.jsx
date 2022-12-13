import { useNavigate } from "react-router";
import { UserAuth } from "../../../context/AuthContext";
import classes from "./LogOutBtn.module.scss";

const LogOutBtn = () => {
  const { user, logOut } = UserAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await logOut();
      navigate("/auth");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <button onClick={handleSignOut} className={classes.logOutBtn}>
      <span className={classes.user}>Log Out</span>
    </button>
  );
};

export default LogOutBtn;
