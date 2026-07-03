import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import * as SecureStore from "expo-secure-store";

// https://dribbble.com/shots/20888824-App-Temperature-Control
const index = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const verify = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      console.log("token in user storage");
      console.log(token);
      if (!token) {
        router.push("/signin");
      }
      const response = await fetch("http://192.168.8.146:3000/auth/verify", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      if (result.status == "ERROR") {
        setLoading(false);
        return router.navigate("/welcome");
      }
      console.log(result);

      router.navigate("/logged/main");
      // router.navigate("/signup");
    } catch (error) {
      console.error("GET error:", error);
    } finally {
      console.log("GET request completed");
      setLoading(false);
    }
  };

  useEffect(() => {
    verify();
  }, []);

  return (
    <View>
      <Text>{loading ? "Loading" : "Done"}</Text>
    </View>
  );
};

export default index;
