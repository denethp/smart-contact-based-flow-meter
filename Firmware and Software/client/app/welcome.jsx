import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Meter from "../components/Meter";
import { useRouter } from "expo-router";

const index = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="">
      <View className="h-full px-6">
        <View className="h-[62%]">
          <View>
            <Meter />
          </View>
        </View>
        <View className="flex-1 justify-between">
          <Text className="text-dark text-center text-3xl font-bold">
            Smart Flow Monitoring at Your Fingertips
          </Text>
          <Text className="text-center text-xl">
            Get real time, accurate flow data straight from your pipe anytime,
            anywhere
          </Text>
        </View>
        <View className="justify-evenly items-center flex-1 flex-row">
          <Pressable
            onPress={() => {
              router.navigate("/signin");
            }}
            className="py-3 px-8 bg-cyan-500 rounded-full"
          >
            <Text className="text-xl text-offwhite">Sign in</Text>
          </Pressable>
          <Pressable
            onPress={() => {
              router.navigate("/signup");
            }}
            className="py-3 px-8 bg-offwhite rounded-full"
          >
            <Text className="text-xl text-dark">Sign up</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
