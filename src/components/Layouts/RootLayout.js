import React, { useEffect } from "react";
import ResponsiveDrawer from "../Navigation/Navbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsLoggedIn, selectUser } from "redux/features/user/userSlice";
import { selectDrawerWidth } from "redux/features/app/configSlice";
import { apiCall } from "redux/async/asyncThunk";

const RootLayout = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  let drawerWidth = useSelector(selectDrawerWidth);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const isTrade = path.includes("trade/spot");
  isTrade ? (drawerWidth = "0px") : (drawerWidth = drawerWidth);

  const excludedPaths = ["trade", "transact"];
  const currentPath = useLocation().pathname;
  useEffect(() => {
    if (isLoggedIn) {
      if (excludedPaths.some((path) => currentPath.includes(path))) return;

      dispatch(
        apiCall({
          endpoint: "user/user-info",
          method: "post",
          data: {
            userId: user.userId,
          },
          slice: "userData",
        })
      );
    } else {
      navigate("login");
    }
  }, [currentPath, isLoggedIn]);

  return (
    <ResponsiveDrawer>
      <Outlet />
    </ResponsiveDrawer>
  );
};

export default RootLayout;
