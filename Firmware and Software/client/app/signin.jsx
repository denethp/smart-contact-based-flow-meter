import {
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  LayoutAnimation,
  UIManager,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Meter from "../components/Meter";
import Mobile from "../components/Mobile";
import Google from "../components/Google";
import Apple from "../components/Apple";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const index = () => {
  const router = useRouter();
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const onSignin = async () => {
    try {
      console.log(JSON.stringify({ email, pass }));
      const response = await fetch("http://192.168.8.146:3000/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, pass }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      if (result.code == "INVALID_USER") return Alert.alert("Incorrect email");
      else if (result.code == "INCORRECT_PASSWORD")
        return Alert.alert("Incorrect password");
      await SecureStore.setItemAsync("token", result.data.token);

      if (result.status == "SUCCESS") router.push("/logged/main");

      console.log("POST success:", result);
    } catch (error) {
      console.error("POST error:", error);
    } finally {
      console.log("POST request completed");
    }
  };

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardWillShow", () =>
      setKeyboardVisible(true)
    );
    const hideSub = Keyboard.addListener("keyboardWillHide", () =>
      setKeyboardVisible(false)
    );
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [keyboardVisible]);

  return (
    <SafeAreaView className="">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="h-full px-6">
            {!keyboardVisible && (
              <View className="relative h-[38%]">
                <View className="w-[200] aspect-square">
                  <Meter />
                </View>
                <View className="right-0 bottom-0 absolute aspect-square w-[80]">
                  <Mobile />
                </View>
              </View>
            )}

            <View className="flex-1 gap-5 justify-center">
              <Text className="text-3xl font-bold">Sign in Here</Text>
              <Text className="text-xl">Welcome back you've been missed!</Text>
              <TextInput
                onChangeText={setEmail}
                placeholder="Email"
                className="px-6 text-xl w-full h-16 rounded-xl bg-gray-200"
              ></TextInput>
              <TextInput
                onChangeText={setPass}
                placeholder="Password"
                className="px-6 text-xl w-full h-16 rounded-xl bg-gray-200"
              ></TextInput>
              <View className="">
                <Text className="text-right">Forgot your password?</Text>
              </View>
              <View className="justify-center items-center ">
                <Pressable
                  onPress={onSignin}
                  className="w-full h-16 justify-center bg-sky-500 rounded-xl"
                >
                  <Text className="text-center text-xl text-offwhite font-semibold">
                    Sign in
                  </Text>
                </Pressable>
              </View>
            </View>
            <View className="mb-1">
              <Text className="text-center py-2">Or continue with</Text>
              <View className="flex-row justify-center gap-4">
                <View className="bg-gray-200 rounded-lg p-3 w-14 aspect-square">
                  <Google />
                </View>
                <View className="bg-gray-200 rounded-lg p-3 w-14 aspect-square">
                  <Apple />
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
