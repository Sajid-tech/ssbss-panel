import { App } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/auth/authSlice";
import { persistor } from "../store/store";

const useLogout = () => {
  const { message } = App.useApp();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // await trigger({
      //   url: PANEL_LOGOUT,
      //   method: "post",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      await persistor.flush();
      // localStorage.clear();
      dispatch(logout());

      navigate("/");
      setTimeout(() => persistor.purge(), 1000);
    } catch (error) {
      message.error(error?.response?.data?.message || "Logout Error");
    }
  };

  return handleLogout;
};

export default useLogout;
