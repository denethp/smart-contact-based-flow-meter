import { Text, View } from "react-native";
import { useCurrentFlowmeter } from "../../../contexts/CurrentFlowmeterContext";

const info = () => {
  const { currentFlowmeter } = useCurrentFlowmeter();
  return (
    <View className="flex-1">
      <View className="h-full flex-col items-center justify-center">
        <View className="flex-col gap-4">
          <View>
            <Text className="text-xl font-semibold">Product Code</Text>
            <Text className="text-xl">{currentFlowmeter.product_code}</Text>
          </View>
          <View>
            <Text className="text-xl font-semibold">Access Key</Text>
            <Text className="text-xl">ygD8w7at</Text>
          </View>
          <View>
            <Text className="text-xl font-semibold">Manufacture Date</Text>
            <Text className="text-xl">{currentFlowmeter.created_at}</Text>
          </View>
          <View>
            <Text className="text-xl font-semibold">Purchase Date</Text>
            <Text className="text-xl">{currentFlowmeter.purchase_date}</Text>
          </View>
          <View>
            <Text className="text-xl font-semibold">Underflow Limit</Text>
            <Text className="text-xl">
              {currentFlowmeter.lower_limit == -1
                ? "No Limit"
                : currentFlowmeter.lower_limit}
            </Text>
          </View>
          <View>
            <Text className="text-xl font-semibold">Overflow Limit</Text>
            <Text className="text-xl">
              {currentFlowmeter.upper_limit == -1
                ? "No Limit"
                : currentFlowmeter.upper_limit}
            </Text>
          </View>
          <View>
            <Text className="text-xl font-semibold">WiFi SSID</Text>
            <Text className="text-xl">SLT FIBER</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default info;
