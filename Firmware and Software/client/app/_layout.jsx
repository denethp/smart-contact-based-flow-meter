import { StatusBar, View } from "react-native";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import "../global.css";
import "react-native-reanimated";
import "react-native-gesture-handler";
import { useEffect } from "react";
import { Toaster } from "@masumdev/rn-toast";

const RootLayout = () => {
  useEffect(() => {
    console.log("Root Layout mounting ");
    return () => {
      console.log("Root layout unmounting");
    };
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <Toaster />
      <StatusBar
        barStyle="dark-content" // or "dark-content"
        backgroundColor="#161716" // Android only
      />
      <Slot />
    </View>
  );
};

export default RootLayout;
