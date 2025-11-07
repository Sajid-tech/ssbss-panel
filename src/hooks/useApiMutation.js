// import { useState } from "react";
// import axiosInstance from "../api/axios";

// export function useApiMutation() {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const trigger = async ({
//     url,
//     method = "get",
//     data = null,
//     params = null,
//     headers = {},
//   }) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await axiosInstance({
//         url,
//         method,
//         data,
//         params,
//         headers,
//       });
//       return response.data;
//     } catch (err) {
//       setError(err);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { trigger, loading, error };
// }
import { useState } from "react";
import axiosInstance from "../api/axios";
import { useSelector } from "react-redux";

export function useApiMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const token = useSelector((state) => state.auth.token);

  const trigger = async ({
    url,
    method = "get",
    data = null,
    params = null,
    headers = {},
  }) => {
    setLoading(true);
    setError(null);
    try {
      // 🔹 Get token from localStorage (or sessionStorage)

      const response = await axiosInstance({
        url,
        method,
        data,
        params,
        headers: {
          ...headers,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { trigger, loading, error };
}
