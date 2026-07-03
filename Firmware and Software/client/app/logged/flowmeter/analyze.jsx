import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { LineChart } from "react-native-chart-kit";
import TimeComponent from "../../../components/TimeComponent";
import { usePfetch } from "../../../hooks/usePfetch";
import { useCurrentFlowmeter } from "../../../contexts/CurrentFlowmeterContext";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import { ActivityIndicator } from "react-native";
import { MotiView } from "moti";

const v = {
  0: "30 seconds",
  1: "60 seconds",
  2: "5 minutes",
  3: "10 minutes",
  4: "20 minutes",
};
const analyze = () => {
  const { wsData } = useWebSocket();
  const { currentFlowmeter } = useCurrentFlowmeter();
  const pfetch = usePfetch();
  const [trange, setTrange] = useState(0);
  const [temperatureData, setTemperatureData] = useState([]);
  const [times, setTimes] = useState([]);
  const [flowData, setFlowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const inactiveTimerRef = useRef(null);

  useEffect(() => {
    if (wsData && wsData.hasOwnProperty("product_code")) {
      if (wsData.product_code == currentFlowmeter.product_code) {
        if (wsData.active) {
          if (inactiveTimerRef.current) {
            clearInterval(inactiveTimerRef.current);
            inactiveTimerRef.current = null;
          }

          setFlowData((prevData) => {
            const updated = [...prevData, wsData.flowrate];
            updated.shift();
            return updated;
          });

          setTimes((prevData) => {
            const updated = [...prevData, wsData.timestamp];
            updated.shift();
            return updated;
          });

          setTemperatureData((prevData) => {
            const updated = [...prevData, wsData.temperature];
            updated.shift();
            return updated;
          });
        } else {
          if (!inactiveTimerRef.current) {
            inactiveTimerRef.current = setInterval(() => {
              setFlowData((prev) => {
                const updated = [...prev, 0];
                updated.shift();
                return updated;
              });

              setTemperatureData((prev) => {
                const updated = [...prev, 0];
                updated.shift();
                return updated;
              });

              setTimes((prev) => {
                const updated = [...prev, Date.now()];
                updated.shift();
                return updated;
              });
            }, 1000);
          }
        }
      }
    }
    return () => {
      if (inactiveTimerRef.current) {
        clearInterval(inactiveTimerRef.current);
        inactiveTimerRef.current = null;
      }
    };
  }, [wsData]);

  async function loadFlowData(t) {
    try {
      setLoading(true);

      if (inactiveTimerRef.current) {
        clearInterval(inactiveTimerRef.current);
        inactiveTimerRef.current = null;
      }
      const data = await pfetch(
        `/fetch/flowmeter/flowdata?trange=${t}&product_code=${currentFlowmeter.product_code}`,
        {
          method: "GET",
        }
      );

      setFlowData(data.flowrate_values);
      setTemperatureData(data.temperature_values);
      setTimes(data.times);

      if (!inactiveTimerRef.current) {
        inactiveTimerRef.current = setInterval(() => {
          setFlowData((prev) => {
            const updated = [...prev, 0];
            updated.shift();
            return updated;
          });

          setTemperatureData((prev) => {
            const updated = [...prev, 0];
            updated.shift();
            return updated;
          });

          setTimes((prev) => {
            const updated = [...prev, Date.now()];
            updated.shift();
            return updated;
          });
        }, 1000);
      }
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch products:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFlowData(trange);
  }, [trange]);

  return (
    <View className="flex-1">
      <View className="my-6 flex-row gap-5 h-16">
        <TimeComponent
          loading={loading}
          text={"30s"}
          id={0}
          setTrange={setTrange}
          trange={trange}
        />
        <TimeComponent
          loading={loading}
          text={"60s"}
          id={1}
          setTrange={setTrange}
          trange={trange}
        />
        <TimeComponent
          loading={loading}
          text={"5m"}
          id={2}
          setTrange={setTrange}
          trange={trange}
        />
        <TimeComponent
          loading={loading}
          text={"10m"}
          id={3}
          setTrange={setTrange}
          trange={trange}
        />
        <TimeComponent
          loading={loading}
          text={"20m"}
          id={4}
          setTrange={setTrange}
          trange={trange}
        />
      </View>
      {loading ? (
        <View className="h-full w-full flex items-center justify-center">
          <View className="w-32 rlative mb-32">
            {/* <LoadingDots /> */}

            <ActivityIndicator size="large" color="#000" />
          </View>
        </View>
      ) : (
        <>
          <Text className="text-xl text-dark font-semibold mb-3">
            Flow rate
          </Text>
          <MotiView
            from={{ opacity: 0, translateX: 100 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: 100 }}
            transition={{ type: "timing", duration: 600 }}
            className="overflow-hidden relative"
          >
            <LineChart
              data={{
                labels: times,
                datasets: [{ data: flowData }],
              }}
              width={Dimensions.get("window").width - 46}
              height={(Dimensions.get("window").height - 400) / 2 - 50}
              chartConfig={{
                // className="bg-cyan-300"
                backgroundGradientFrom: "#f5f5f5",
                backgroundGradientTo: "#f5f5f5",
                decimalPlaces: 1,
                color: (opacity = 255) => `rgba(33,33,38,${opacity})`,
                labelColor: (opacity = 1) => `rgba(33, 33, 38, ${opacity})`,
              }}
              style={{ paddingRight: 40 }}
              bezier
              withDots={false}
              withHorizontalLines={true}
              withVerticalLines={false}
              withScrollableDot={false}
              withHorizontalLabels={true}
              withVerticalLabels={false}
              withShadow={true}
            />
            <Text className="w-full text-center absolute bottom-0 text-dark">
              {"Last " + v[trange]}
            </Text>
          </MotiView>

          <Text className="text-xl text-dark font-semibold mt-3 mb-3">
            Temperature
          </Text>
          <MotiView
            from={{ opacity: 0, translateX: -100 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: -100 }}
            transition={{ type: "timing", duration: 600 }}
            className="overflow-hidden relative"
          >
            <LineChart
              data={{
                labels: times,
                datasets: [{ data: temperatureData }],
              }}
              width={Dimensions.get("window").width - 46}
              height={(Dimensions.get("window").height - 400) / 2 - 50}
              chartConfig={{
                // className="bg-cyan-300"
                backgroundGradientFrom: "#f5f5f5",
                backgroundGradientTo: "#f5f5f5",
                decimalPlaces: 1,
                color: (opacity = 255) => `rgba(33,33,38,${opacity})`,
                labelColor: (opacity = 1) => `rgba(33, 33, 38, ${opacity})`,
              }}
              style={{ paddingRight: 40 }}
              bezier
              withDots={false}
              withHorizontalLines={true}
              withVerticalLines={false}
              withScrollableDot={false}
              withHorizontalLabels={true}
              withVerticalLabels={false}
              withShadow={true}
            />
            <Text className="w-full text-center text-dark absolute bottom-0">
              {"Last " + v[trange]}
            </Text>
          </MotiView>
        </>
      )}
    </View>
  );
};

export default analyze;

const styles = StyleSheet.create({});
