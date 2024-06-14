import useUserData from "Hooks/useUserData";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { apiCall } from "redux/async/asyncThunk";
import {
  loginFailed,
  loginSuccess,
  selectUserError,
  selectUserStatus,
} from "redux/features/user/userSlice";

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userStatus = useSelector(selectUserStatus);
  const userData = useUserData();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const userId = params.get("userId");
  if (!userId) {
    dispatch(loginFailed({ error: "No user ID" }));
    navigate("/login");
  }
  const userPayload = {
    ...userData,
    userId,
  };
  console.log(userPayload);

  dispatch(loginSuccess(userPayload));
  return navigate("/dashboard");
};

export default GoogleCallback;
