import Monitor_Range from "../../../components/Monitor_Range";
import Monitor_Value from "../../../components/Monitor_Value";
import Monitor_Temperature from "../../../components/Monitor_Temperature";
import Monitor_TotalFluid from "../../../components/Monitor_TotalFluid";
import { View } from "react-native";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import { useEffect, useState } from "react";
import { useCurrentFlowmeter } from "../../../contexts/CurrentFlowmeterContext";
import { AnimatePresence, MotiView } from "moti";

const monitor = () => {
  const [flowrate, setFlowrate] = useState(0);
  const [temperature, setTemperature] = useState(0);
  const [totalVolume, setTotalVolume] = useState(0);
  const [idealFlow, setIdealFlow] = useState(true);
  const [active, setActive] = useState(false);

  const { currentFlowmeter } = useCurrentFlowmeter();
  const { wsData } = useWebSocket();

  useEffect(() => {
    if (
      currentFlowmeter &&
      wsData &&
      currentFlowmeter.hasOwnProperty("product_code") &&
      wsData.hasOwnProperty("product_code")
    ) {
      if (currentFlowmeter.product_code == wsData.product_code) {
        setFlowrate(wsData.flowrate);
        setTemperature(wsData.temperature);
        setTotalVolume(wsData.total_volume);
        if (
          (wsData.flowrate < currentFlowmeter.lower_limit &&
            currentFlowmeter.lower_limit != -1) ||
          (wsData.flowrate > currentFlowmeter.upper_limit &&
            currentFlowmeter.upper_limit != -1)
        ) {
          setIdealFlow(false);
        } else {
          setIdealFlow(true);
        }
      }
    }
  }, [wsData, currentFlowmeter]);

  return (
    <View className="flex-1">
      <View className="h-[62%] w-full justify-center items-center">
        <Monitor_Value flowrate={flowrate} />
      </View>
      <View className="flex-1 gap-3 flex-row justify-between ">
        <Monitor_Temperature temperature={temperature} />
        <Monitor_Range
          idealFlow={idealFlow}
          ul={currentFlowmeter.upper_limit}
          ll={currentFlowmeter.lower_limit}
        />
        <Monitor_TotalFluid totalVolume={totalVolume} />
      </View>
    </View>
  );
};

export default monitor;
