import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import WaterPipe from "../components/WaterPipe";
import { MotiView } from "moti";

const signup = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [repass, setRepass] = useState("");

  const onSignup = async () => {
    try {
      const response = await fetch("http://192.168.8.146:3000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pass, repass }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("POST success:", result);
      router.navigate("/signin");
    } catch (error) {
      console.error("POST error:", error);
    } finally {
      console.log("POST request completed");
    }
  };

  return (
    <SafeAreaView className="">
      <View className="h-full px-6 flex items-center justify-center">
        <MotiView
          from={{ opacity: 0, translateY: -100 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -100 }}
          transition={{ type: "timing", duration: 400 }}
          className="h-64 aspect-square"
        >
          <WaterPipe />
        </MotiView>
        <MotiView
          from={{ opacity: 0, translateX: -100 }}
          animate={{ opacity: 1, translateX: 0 }}
          exit={{ opacity: 0, translateX: -100 }}
          transition={{ type: "timing", duration: 400 }}
          className="flex-1 gap-5 justify-center w-full"
        >
          <Text className="text-3xl font-bold">Sign up Here</Text>
          <Text className="text-xl">Welcome! You're just one step away</Text>
          <TextInput
            placeholder="Company / Name"
            className="px-6 text-xl w-full h-16 rounded-xl bg-gray-200"
            value={name}
            onChangeText={setName}
          ></TextInput>
          <TextInput
            placeholder="Email"
            className="px-6 text-xl w-full h-16 rounded-xl bg-gray-200"
            value={email}
            onChangeText={setEmail}
          ></TextInput>
          <TextInput
            placeholder="Password"
            className="px-6 text-xl w-full h-16 rounded-xl bg-gray-200"
            value={pass}
            onChangeText={setPass}
          ></TextInput>
          <TextInput
            placeholder="Confirm password"
            className="px-6 text-xl w-full h-16 rounded-xl bg-gray-200"
            value={repass}
            onChangeText={setRepass}
          ></TextInput>

          <View className="justify-center items-center ">
            <Pressable
              onPress={onSignup}
              className="w-full h-16 justify-center bg-cyan-500 rounded-xl"
            >
              <Text className="text-center text-xl text-offwhite font-semibold">
                Sign up
              </Text>
            </Pressable>
          </View>
        </MotiView>
      </View>
    </SafeAreaView>
  );
};

export default signup;

const styles = StyleSheet.create({});
