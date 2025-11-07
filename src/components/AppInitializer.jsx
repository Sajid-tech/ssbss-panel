import { App } from "antd";
import CryptoJS from "crypto-js";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { DOT_ENV, PANEL_CHECK } from "../api";
import usetoken from "../api/usetoken";
import { useApiMutation } from "../hooks/useApiMutation";
import useLogout from "../hooks/useLogout";
import { logout } from "../store/auth/authSlice";
import { setCompanyDetails, setCompanyImage } from "../store/auth/companySlice";
import { setShowUpdateDialog } from "../store/auth/versionSlice";
import { persistor } from "../store/store";

const secretKey = import.meta.env.VITE_SECRET_KEY;
const validationKey = import.meta.env.VITE_SECRET_VALIDATION;
const AppInitializer = ({ children }) => {
  const Logout = useLogout();

  const { trigger } = useApiMutation();
  const { message } = App.useApp();
  const token = usetoken();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const localVersion = useSelector((state) => state.auth?.version);

  useEffect(() => {
    const validateEnvironment = async () => {
      try {
        if (!secretKey || !validationKey) {
          throw new Error("Missing environment configuration");
        }

        const statusRes = await trigger({ url: PANEL_CHECK });
        if (statusRes?.message !== "Success") {
          throw new Error("Panel status check failed");
        }

        const serverVer = statusRes?.version?.version_panel;

        if (statusRes?.code === 201) {
          dispatch(setCompanyDetails(statusRes?.company_detils));
          dispatch(setCompanyImage(statusRes?.company_image));
        } else {
          console.warn("⚠️ Failed to fetch company details");
        }
        if (token) {
          dispatch(
            setShowUpdateDialog({
              showUpdateDialog: localVersion !== serverVer,
              version: serverVer,
            })
          );
        }

        const dotenvRes = await trigger({ url: DOT_ENV });
        const dynamicValidationKey = dotenvRes?.data;
        const computedHash = CryptoJS.MD5(validationKey).toString();

        if (!dynamicValidationKey || computedHash !== dynamicValidationKey) {
          throw new Error("Invalid environment config");
        }

        // if (location.pathname === "/maintenance") {
        //   navigate("/");
        // }
        if (location.pathname === "/maintenance") {
          navigate("/");
        }
      } catch (error) {
        console.error("❌ App Initialization Error:", error.message);

        Logout();
        dispatch(logout());
        setTimeout(() => persistor.purge(), 1000);

        message.error(error.message || "Environment Error");

        if (location.pathname !== "/maintenance") {
          navigate("/maintenance");
        }
      }
    };

    

    validateEnvironment();
  }, [dispatch, navigate]);

  return children;
};

export default AppInitializer;
