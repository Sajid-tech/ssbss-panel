import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Layout from "./Layout";

const ProtectedLayout = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  if (!token) {
    return <Navigate to="/" />;
  }

  return <Layout>{children}</Layout>;
};

export default ProtectedLayout;
