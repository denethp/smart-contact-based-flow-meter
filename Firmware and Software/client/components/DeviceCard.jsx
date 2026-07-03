import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useCurrentFlowmeter } from "../contexts/CurrentFlowmeterContext";
import { useWebSocket } from "../contexts/WebSocketContext";
import { useEffect, useState } from "react";
import IconWaterDrop from "./IconWaterDrop";
import IconTemp from "./IconTemp";
import IconFlow from "./IconFlow";
import { MotiView } from "moti";

const DeviceCard = ({ data }) => {
  const router = useRouter();
  const { setCurrentFlowmeter } = useCurrentFlowmeter();

  const { wsData } = useWebSocket();
  const [flowrate, setFlowrate] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (wsData && data) {
      if (
        wsData.hasOwnProperty("product_code") &&
        data.product_code == wsData.product_code
      ) {
        setFlowrate(wsData.flowrate);
        setTemperature(wsData.temperature);
        setTotalVolume(wsData.total_volume);
        setActive(wsData.active);
      }
    }
  }, [wsData]);

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.5 }}
      className="flex-1"
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ type: "timing", duration: 500 }}
      style={{}}
    >
      <Pressable
        onPress={() => {
          router.navigate("./flowmeter/monitor");
          setCurrentFlowmeter(data);
        }}
        className="bg-gray-200 h-32 rounded-xl flex-row p-2"
      >
        <View className="w-[38%] h-full items-center">
          <View className="relative h-full w-full rounded-tl-lg rounded-bl-lg rounded-lg bg-gray-600 items-center justify-center">
            <View
              className={`absolute h-3.5 aspect-square rounded-full ${
                active ? "bg-emerald-500" : "bg-gray-300"
              } top-2 left-2`}
            ></View>
            <Text className="text-offwhite text-2xl font-semibold">
              {data.product_code}
            </Text>
          </View>
        </View>
        <View className=" flex-1 h-full items-center justify-center">
          <View className="h-[60%] w-full">
            <View className="h-full justify-evenly gap-4 flex-row">
              <View className="flex-1 h-full justify-center items-center">
                <View className="mt-3 w-14 aspect-square">
                  <IconFlow />
                </View>
              </View>
              <View className="flex-1 h-full justify-center items-center">
                <View className="w-12 aspect-square">
                  <IconTemp />
                </View>
              </View>
              <View className="flex-1 h-full justify-center items-center">
                <View className="w-12 aspect-square">
                  <IconWaterDrop />
                </View>
              </View>
            </View>
          </View>
          <View className="flex-1 w-full">
            <View className="h-full justify-evenly gap-4 flex-row">
              <View className="flex-1 h-full justify-center items-center">
                <Text className="text-lg font-semibold">
                  {flowrate ? Number(flowrate.toFixed(1)) : 0}
                </Text>
              </View>
              <View className="flex-1 h-full justify-center items-center">
                <Text className="text-lg font-semibold">
                  {temperature ? Number(temperature.toFixed(1)) : 0}
                </Text>
              </View>
              <View className="flex-1 h-full justify-center items-center">
                <View className="">
                  <Text className="text-lg font-semibold">
                    {totalVolume ? Number(totalVolume.toFixed(2)) : 0}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View className="flex-1 w-full">
            <View className="h-full justify-evenly gap-4 flex-row">
              <View className="flex-1 h-full justify-center items-center">
                <View className="">
                  <Text className="">{`Ls\u207B\u00B9`}</Text>
                </View>
              </View>
              <View className="flex-1 h-full justify-center items-center">
                <View className="">
                  <Text className="text-sm">{"\u00B0"}C</Text>
                </View>
              </View>
              <View className="flex-1 h-full justify-center items-center">
                <View className="">
                  <Text className="">{`L`}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </MotiView>
  );
};

export default DeviceCard;
