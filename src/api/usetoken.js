import { useSelector } from "react-redux";

const useToken = () => {
  return useSelector((state) => state.auth.token);
};
export default useToken;
