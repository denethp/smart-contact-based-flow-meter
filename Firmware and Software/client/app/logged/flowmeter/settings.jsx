import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { usePfetch } from "../../../hooks/usePfetch";
import { useCurrentFlowmeter } from "../../../contexts/CurrentFlowmeterContext";
import Err from "../../../utils/errClass";
import { useToast } from "@masumdev/rn-toast";

const settings = () => {
  const { currentFlowmeter } = useCurrentFlowmeter();
  const [ssid, setSsid] = useState("default");
  const [pass, setPass] = useState("default");
  const [ul, setUl] = useState("default");
  const [ll, setLl] = useState("default");
  const { showToast } = useToast();

  const pfetch = usePfetch();

  const handleUpdate = async () => {
    try {
      await pfetch("/update/flowmeter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product_code: currentFlowmeter.product_code,
          ssid: ssid,
          pass: pass,
          upper_limit: ul,
          lower_limit: ll,
        }),
      });
      showToast("Updated successfully", "success", { position: 180 });
    } catch (err) {
      if (err instanceof Err) {
        console.log("err.message");
        if (err.message == "FLOWMETER_OFFLINE") {
          showToast("Flowmeter is offline", "error", { position: 180 });
        } else if (err.message == "INVALID_UPPER_LIMIT") {
          showToast("Invalid upper limit", "error", { position: 180 });
        } else if (err.message == "INVALID_LOWER_LIMIT") {
          showToast("Invalid lower limit", "error", { position: 180 });
        } else if (err.message == "UPPER_LOWER_LIMIT_MISMATCH") {
          showToast("There is a problem with the limits", "error", {
            position: 4.2,
          });
        } else {
        }
      } else {
        showToast("Something went wrong", "error", { position: 120 });
      }
    }
  };

  return (
    <View className="flex-1">
      <View className="h-full w-full flex flex-col gap-4 justify-center">
        <View>
          <Text className="text-xl font-semibold pl-2 text-dark">
            Access key
          </Text>
          <TextInput className="rounded-2xl bg-gray-200 h-14 px-6 text-lg "></TextInput>
        </View>
        <View>
          <Text className="text-xl font-semibold pl-2 text-dark">
            WiFi SSID
          </Text>
          <TextInput
            onChangeText={setSsid}
            className="rounded-2xl bg-gray-200 h-14 px-6 text-lg"
          ></TextInput>
        </View>
        <View>
          <Text className="text-xl font-semibold pl-2 text-dark">
            WiFi Password
          </Text>
          <TextInput
            onChangeText={setPass}
            className="rounded-2xl bg-gray-200 h-14 px-6 text-lg"
          ></TextInput>
        </View>
        <View>
          <Text className="text-xl font-semibold pl-2 text-dark">
            Lower Limit
          </Text>
          <TextInput
            onChangeText={setLl}
            className="rounded-2xl bg-gray-200 h-14 px-6 text-lg"
          ></TextInput>
        </View>
        <View>
          <Text className="text-xl font-semibold pl-2 text-dark">
            Upper Limit
          </Text>
          <TextInput
            onChangeText={setUl}
            className="rounded-2xl bg-gray-200 h-14 px-6 text-lg "
          ></TextInput>
        </View>

        <Pressable
          onPress={handleUpdate}
          className="mt-4 h-16 items-center justify-center bg-orange-300 rounded-full"
        >
          <Text className="text-xl font-semibold text-dark">Update</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default settings;
