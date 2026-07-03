import { MotiView } from "moti";
import { Text, View } from "react-native";
import FlowValuePipe from "./FlowValuePipe";

const Monitor_Value = ({ flowrate }) => {
  return (
    <MotiView
      from={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ type: "timing", duration: 500 }}
      className="rounded-full justify-center items-center bg-gray-200 h-[72%] aspect-square"
    >
      <View className="justify-center items-center h-[72%] w-[72%] bg-offwhite rounded-full">
        <View>
          <Text className="font-semibold text-7xl text-dark">
            {flowrate ? Number(flowrate.toFixed(1)) : 0}
          </Text>
        </View>
      </View>
    </MotiView>
  );
};

export default Monitor_Value;
