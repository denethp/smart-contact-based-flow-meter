import { Text, View } from "react-native";
import IconTemp from "./IconTemp";
import { MotiView } from "moti";

const Monitor_Temperature = ({ temperature }) => {
  return (
    <MotiView
      from={{ opacity: 0, translateX: -100 }}
      animate={{ opacity: 1, translateX: 0 }}
      exit={{ opacity: 0, translateX: -100 }}
      transition={{ type: "timing", duration: 400 }}
      style={{ borderRadius: 30 }}
      className="flex-1 bg-red-200 h-full"
    >
      <View>
        <View className="pt-2 h-1/3 items-center justify-center">
          <View className="items-center">
            <Text className="text-red-400 font-semibold">Temperature</Text>
            <Text className="text-red-400 font-semibold">{`(\u00B0C)`}</Text>
          </View>
        </View>
        <View className="h-1/3 items-center">
          <View className="items-center justify-center h-full aspect-square rounded-full bg-offwhite">
            <View className="h-12 w-12">
              <IconTemp dark={false} width={0.95} />
            </View>
          </View>
        </View>
        <View className="h-1/3 items-center justify-center">
          <Text className="text-xl text-dark font-semibold">{`${Number(
            temperature ? temperature.toFixed(1) : 0
          )}`}</Text>
        </View>
      </View>
    </MotiView>
  );
};

export default Monitor_Temperature;
