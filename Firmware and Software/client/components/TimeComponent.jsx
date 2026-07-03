import { Pressable, StyleSheet, Text } from "react-native";
import React from "react";

const TimeComponent = ({ setTrange, id, trange, text, loading }) => {
  const handlePress = () => {
    if (id == trange || loading == true) return;
    setTrange(id);
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`flex-1 box-1 h-full ${
        trange == id ? "bg-emerald-400" : "bg-gray-200"
      } rounded-xl items-center justify-center`}
    >
      <Text
        className={`${
          trange == id ? "text-offwhite" : "text-dark"
        } font-semibold`}
      >
        {text}
      </Text>
    </Pressable>
  );
};

export default TimeComponent;

const styles = StyleSheet.create({});
