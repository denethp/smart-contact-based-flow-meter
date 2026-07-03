import { Pressable, Text, View } from "react-native";
import BackButton from "../../../components/BackButton";
import { Slot, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import IconSettings from "../../../components/IconSettings";
import IconBell from "../../../components/IconBell";
import { useState } from "react";
import { useCurrentFlowmeter } from "../../../contexts/CurrentFlowmeterContext";

const Home = () => {
  const [monitorTab, setMonitorTab] = useState(0);
  const router = useRouter();

  const { currentFlowmeter } = useCurrentFlowmeter();

  const handleMonitorTabChange = (mtab) => {
    if (
      monitorTab == mtab ||
      (mtab != 0 && mtab != 1 && mtab != 2 && mtab != 3)
    )
      return;
    setMonitorTab(mtab);
    if (mtab == 0) return router.navigate("./monitor");
    else if (mtab == 1) return router.navigate("./info");
    else if (mtab == 2) return router.navigate("./analyze");
    else if (mtab == 3) return router.navigate("./settings");
  };

  const onPressBack = () => {
    router.navigate("../main");
  };

  return (
    <SafeAreaView className="bg-offwhite">
      <View className="bg-offwhite h-full px-6">
        <View className="py-5 justify-between items-center flex-row">
          <Pressable onPress={onPressBack} className="h-10 aspect-square">
            <BackButton />
          </Pressable>
          <View>
            <Text className="font-bold text-4xl">
              {currentFlowmeter?.product_code}
            </Text>
          </View>
          <View className="h-10 w-10">
            <IconBell />
          </View>
        </View>

        <View className="flex-row w-full justify-between">
          <Pressable
            className={`rounded-full py-3 px-8 ${
              monitorTab === 0 ? "bg-dark" : "bg-gray-200"
            }`}
            onPress={() => {
              handleMonitorTabChange(0);
            }}
          >
            <Text
              className={`text-xl ${
                monitorTab == 0 ? "text-offwhite" : "text-dark"
              }`}
            >
              Monitor
            </Text>
          </Pressable>
          <Pressable
            className={`rounded-full py-3 px-8 ${
              monitorTab === 1 ? "bg-dark" : "bg-gray-200"
            }`}
            onPress={() => {
              handleMonitorTabChange(1);
            }}
          >
            <Text
              className={`text-xl ${
                monitorTab == 1 ? "text-offwhite" : "text-dark"
              }`}
            >
              Info
            </Text>
          </Pressable>
          <Pressable
            className={`rounded-full py-3 px-8 ${
              monitorTab === 2 ? "bg-dark" : "bg-gray-200"
            }`}
            onPress={() => {
              handleMonitorTabChange(2);
            }}
          >
            <Text
              className={`text-xl ${
                monitorTab == 2 ? "text-offwhite" : "text-dark"
              }`}
            >
              Analyze
            </Text>
          </Pressable>
        </View>

        <Slot />

        <View className="mt-4 w-full h-24 py-3 items-center justify-center">
          <Pressable
            onPress={() => {
              handleMonitorTabChange(3);
            }}
            className={`p-2 h-full w-[80] rounded-full ${
              monitorTab == 3 ? "bg-dark" : "bg-gray-200"
            }`}
          >
            <IconSettings dark={monitorTab == 3 ? false : true} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
