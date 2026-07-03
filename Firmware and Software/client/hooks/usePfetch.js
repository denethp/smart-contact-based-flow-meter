import Err from "../utils/errClass";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

export const usePfetch = () => {
  const router = useRouter();

  const pfetch = async (url, options) => {
    try {
      const token = await SecureStore.getItemAsync("token");
      console.log("token in user storage at pfetch");
      console.log(token);
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
          // "client-uid": userData ? userData.user_id : -1,
        };
      }

      const res = await fetch("http://192.168.8.146:3000" + url, options);
      if (!res.ok) throw new Err("BAD_RESPONSE");
      const response = await res.json();

      console.log({ response });

      if (response.code == "JWT_NOT_FOUND" || response.code == "JWT_MALFORMED")
        throw new Err("AUTH_FAIL");
      if (response.status === "ERROR") throw new Err(response.code);

      return response.data;
    } catch (err) {
      if (err instanceof Err) {
        if (err.message == "AUTH_FAIL") return router.navigate("/welcome");
        throw err;
      } else {
        //toast
        console.error(err.message);
        throw new Err("UNEXPECTED_ERROR_FRONTEND");
      }
    }
  };

  return pfetch;
};
