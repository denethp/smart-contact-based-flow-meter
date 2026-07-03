import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IconUser from "../../components/IconUser.jsx";
import IconSearch from "../../components/IconSearch.jsx";
import DeviceCard from "../../components/DeviceCard.jsx";
import { usePfetch } from "../../hooks/usePfetch.js";
import { useWebSocket } from "../../contexts/WebSocketContext.jsx";
import { useActiveCount } from "../../contexts/ActiveCountContext.jsx";
import { useToast } from "@masumdev/rn-toast";
import IconAbout from "../../components/IconAbout.jsx";
import { BlurView } from "expo-blur";
import { MotiView } from "moti";
import { useUserData } from "../../contexts/userDataContext.jsx";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const Main = () => {
  const [loading, setLoading] = useState(true);
  const [flowmeters, setFlowmeters] = useState([]);
  const pfetch = usePfetch();
  const { wsData } = useWebSocket();
  const { activeCount, setActiveCount } = useActiveCount();
  const { showToast } = useToast();
  const [about, setAbout] = useState(false);
  const { userData, setUserData } = useUserData();
  const [user, setUser] = useState(false);
  const router = useRouter();

  async function loadFlowmeters() {
    try {
      const data = await pfetch("/fetch/flowmeters", {
        method: "GET",
      });
      console.log(data);
      setFlowmeters(data.flowmeters);
      setActiveCount(data.active_count);
      setUserData(data.user);
    } catch (err) {
      console.error("Failed to fetch products:", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFlowmeters();
  }, []);

  async function signOut() {
    await SecureStore.setItemAsync("token", "");
    router.navigate("../welcome");
  }

  useEffect(() => {
    if (wsData && wsData.hasOwnProperty("active_count")) {
      setActiveCount(wsData.active_count);
    }
  }, [wsData]);

  return (
    <SafeAreaView className="bg-offwhite" style={{ flex: 1 }}>
      <ScrollView className="bg-offwhite h-full px-6">
        {/* Header */}
        <View className="h-16 justify-between flex-row my-4">
          <View className="h-full aspect-square justify-center items-left">
            <Pressable
              className="h-12 aspect-square"
              onPress={() => setAbout(true)}
            >
              <IconAbout />
            </Pressable>
          </View>
          <Pressable
            onPress={() => setUser(true)}
            className="rounded-full h-full bg-dark p-2 aspect-square"
          >
            <IconUser />
          </Pressable>
        </View>

        <View>
          <Text className="font-bold text-3xl text-dark">{`Welcome, ${userData.name}!`}</Text>
        </View>

        <View
          style={{ height: 192 }}
          className="my-4 flex flex-row gap-4 justify-between"
        >
          <View className="flex-1 h-full bg-emerald-200 rounded-xl">
            <View className="relative h-full justify-center items-center">
              <Text className="text-5xl font-semibold text-emerald-500">
                {activeCount}
              </Text>
            </View>
            <View className="w-full absolute bottom-0 h-[38%] justify-center items-center">
              <Text className="text-xl text-emerald-500">Active</Text>
              <Text className="text-xl text-emerald-500">Flow Meters</Text>
            </View>
          </View>
          <View className="flex-1 h-full bg-slate-200 rounded-xl">
            <View className="relative h-full justify-center items-center">
              <Text className="text-5xl font-semibold text-slate-500">
                {flowmeters.length}
              </Text>
            </View>
            <View className="w-full absolute bottom-0 h-[38%] justify-center items-center">
              <Text className="text-xl text-slate-500">Total</Text>
              <Text className="text-xl text-slate-500">Flow Meters</Text>
            </View>
          </View>
        </View>

        <View className="relative">
          <TextInput
            placeholder="Search"
            className="text-xl px-6 w-full bg-gray-200 h-16 rounded-full"
          />
          <View className="h-6 right-6 top-5 absolute aspect-square">
            <IconSearch />
          </View>
        </View>

        {loading ? (
          <Text>Loading</Text>
        ) : (
          <View className="my-4 gap-4">
            {flowmeters.map((flowmeter) => (
              <DeviceCard key={flowmeter.fm_id} data={flowmeter} />
            ))}
          </View>
        )}
      </ScrollView>

      {about && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          pointerEvents="box-none"
        >
          <BlurView
            intensity={60}
            tint="light"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width,
              height,
            }}
          />

          <MotiView
            from={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
            }}
            transition={{
              type: "timing",
              duration: 300,
            }}
            style={{
              width: 350,
              padding: 20,
              backgroundColor: "#f5f5f5",
              borderRadius: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 10,
              zIndex: 1010,
            }}
          >
            <ScrollView className="">
              <Text
                className="text-dark"
                style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
              >
                Neural Nexus
              </Text>
              <Text className="text-dark mb-2">
                This application was developed by Team Neural Nexus as part of a
                smart IoT enabled flow monitoring solution.
              </Text>
              <Text className="text-dark mb-2">
                The system uses a contact-based flow sensor to accurately
                measure the flow rate and temperature of fluids in real-time. It
                continuously monitors these parameters and compares them against
                safe operating thresholds defined by the user.
              </Text>
              <Text className="text-dark mb-2">
                The application connects to the device over Wi-Fi and displays
                real-time sensor data through a user-friendly mobile interface.
              </Text>
              <Text className="text-dark mb-2">
                WebSocket communication ensures low-latency updates, while alert
                mechanisms notify users immediately if abnormal conditions such
                as unsafe flow rates or temperatures are detected.
              </Text>
              <Text className="text-dark mb-2" style={{ marginBottom: 20 }}>
                Beyond real-time monitoring, the system also records historical
                flow data for analysis, enabling users to track consumption
                trends, identify anomalies, and optimize system performance.
                This solution is ideal for water management, industrial fluid
                systems, and smart infrastructure applications where
                reliability, ease of use, and safety are key priorities.
              </Text>
              <Pressable
                onPress={() => setAbout(false)}
                style={{
                  alignSelf: "flex-end",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: "#2196F3",
                  borderRadius: 8,
                }}
              >
                <Text className="text-offwhite font-bold">Close</Text>
              </Pressable>
            </ScrollView>
          </MotiView>
        </View>
      )}

      {user && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width,
            height,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          pointerEvents="box-none"
        >
          <BlurView
            intensity={60}
            tint="light"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width,
              height,
            }}
          />

          <MotiView
            from={{
              opacity: 0,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
            }}
            transition={{
              type: "timing",
              duration: 300,
            }}
            style={{
              width: 350,
              padding: 20,
              backgroundColor: "#f5f5f5",
              borderRadius: 15,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.3,
              shadowRadius: 10,
              elevation: 10,
              zIndex: 1010,
            }}
          >
            <ScrollView className="">
              <View className="flex flex-row items-center justify-between">
                <Text className="text-dark text-3xl font-bold text">
                  {userData.name}
                </Text>
                <Pressable
                  onPress={() => {
                    signOut();
                  }}
                  className="bg-red-400 p-2 rounded-xl"
                >
                  <Text className="text-offwhite font-bold">Sign out</Text>
                </Pressable>
              </View>
              <View className="mt-4 flex gap-4">
                <View>
                  <Text className="text-gray-400">Email</Text>
                  <Text className="text-dark">{userData.email}</Text>
                </View>
                <View>
                  <Text className="text-gray-400">Flow meters owned</Text>
                  <Text className="text-dark">{flowmeters.length}</Text>
                </View>
                <View>
                  <Text className="text-gray-400">Flow meters owned</Text>
                  {flowmeters.map((flowmeter, index) => (
                    <Text key={flowmeter.fm_id || index} className="text-dark">
                      {flowmeter.product_code}
                    </Text>
                  ))}
                </View>
              </View>

              <Pressable
                onPress={() => setUser(false)}
                style={{
                  alignSelf: "flex-end",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: "#2196F3",
                }}
                className="rounded-xl"
              >
                <Text className="text-offwhite font-bold">Close</Text>
              </Pressable>
            </ScrollView>
          </MotiView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Main;
