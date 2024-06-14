import useUserData from "Hooks/useUserData";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { loginFailed, loginSuccess } from "redux/features/user/userSlice";

const GoogleCallback = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useUserData();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const userId = params.get("userId");

  useEffect(() => {
    if (!userId) {
      dispatch(
        loginFailed({ error: "No user ID found in the query parameters." })
      );
      navigate("/login");
      return;
    }

    const userPayload = {
      ...userData,
      userId,
    };

    dispatch(loginSuccess(userPayload));
    navigate("/dashboard");
  }, [dispatch, navigate, userId, userData]);

  return null;
};

export default GoogleCallback;
