import { Text, View } from "react-native";
import IconWaterDrop from "./IconWaterDrop";
import { MotiView } from "moti";

const Monitor_TotalFluid = ({ totalVolume }) => {
  return (
    <MotiView
      from={{ opacity: 0, translateX: 100 }}
      animate={{ opacity: 1, translateX: 0 }}
      exit={{ opacity: 0, translateX: 100 }}
      transition={{ type: "timing", duration: 400 }}
      style={{ borderRadius: 30 }}
      className="flex-1 bg-cyan-200 h-full"
    >
      <View className="h-1/3 items-center justify-center">
        <View className=" items-center">
          <Text className="text-cyan-500 font-semibold">Total Volume</Text>
          <Text className="text-cyan-500 font-semibold">(L)</Text>
        </View>
      </View>
      <View className="h-1/3 items-center">
        <View className="items-center justify-center h-full aspect-square rounded-full bg-offwhite">
          <View className="h-12 w-12">
            <IconWaterDrop />
          </View>
        </View>
      </View>
      <View className="h-1/3 items-center justify-center">
        <Text className="text-xl text-dark font-semibold">
          {totalVolume ? Number(totalVolume.toFixed(2)) : 0}
        </Text>
      </View>
    </MotiView>
  );
};

export default Monitor_TotalFluid;
