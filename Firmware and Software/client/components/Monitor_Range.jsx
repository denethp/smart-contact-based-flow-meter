import { Text, View } from "react-native";
import IconHazard from "../components/IconHazard";
import IconOK from "./IconOK.jsx";
import { MotiView } from "moti";

const Monitor_Range = ({ idealFlow, ul, ll }) => {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 100 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: 100 }}
      transition={{ type: "timing", duration: 400 }}
      // from={{
      //   scale: 1,
      //   rotate: "0deg",
      // }}
      // animate={{
      //   scale: [1, 0.92, 0.92, 1.05, 1],
      //   rotate: [
      //     "0deg",
      //     "-3deg",
      //     "3deg",
      //     "-2deg",
      //     "2deg",
      //     "-1deg",
      //     "1deg",
      //     "0deg",
      //   ],
      // }}
      // transition={{
      //   type: "timing",
      //   duration: 1000,
      //   loop: true,
      //   easing: "ease-in-out",
      // }}
      style={{ borderRadius: 30 }}
      className={`flex-1  ${
        idealFlow ? "bg-emerald-200" : "bg-orange-200"
      } h-full`}
    >
      <View className="h-1/3 items-center justify-center">
        <View className="items-center">
          <Text
            className={`${
              idealFlow ? "text-emerald-500" : "text-orange-500"
            } font-semibold`}
          >
            Safe Range
          </Text>
          <Text
            className={`${
              idealFlow ? "text-emerald-500" : "text-orange-500"
            } font-semibold`}
          >
            {`(Lmin\u207B\u00B9)`}
          </Text>
        </View>
      </View>
      <View className="h-1/3 items-center">
        <View className="items-center justify-center h-full aspect-square rounded-full bg-offwhite">
          <View className="h-12 w-12">
            {idealFlow ? <IconOK /> : <IconHazard />}
          </View>
        </View>
      </View>
      <View className="h-1/3 items-center justify-center">
        <Text className="text-xl text-dark font-semibold">
          {ll == -1 ? "\u221E" : ll} - {ul == -1 ? "\u221E" : ul}
        </Text>
      </View>
    </MotiView>
  );
};

export default Monitor_Range;
