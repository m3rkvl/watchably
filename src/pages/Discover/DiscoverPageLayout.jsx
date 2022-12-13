import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { UserAuth } from "../../context/AuthContext";

const DiscoverPageLayout = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && user !== "loading...") navigate("/auth", { replace: true });
  });
  return <Outlet />;
};

export default DiscoverPageLayout;
