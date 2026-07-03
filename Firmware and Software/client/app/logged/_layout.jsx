import { Slot } from "expo-router";
import { CurrentFlowmeterProvider } from "../../contexts/CurrentFlowmeterContext";
import { WebSocketProvider } from "../../contexts/WebSocketContext";
import { ActiveCountProvider } from "../../contexts/ActiveCountContext";
import { UserDataProvider } from "../../contexts/userDataContext";
import { StatusBar, View } from "react-native";

const RootLayout = () => {
  return (
    <WebSocketProvider>
      <UserDataProvider>
        <CurrentFlowmeterProvider>
          <ActiveCountProvider>
            <View style={{ flex: 1 }}>
              <StatusBar
                barStyle="dark-content" // or "dark-content"
                backgroundColor="#161716" // Android only
              />
              <Slot />
            </View>
          </ActiveCountProvider>
        </CurrentFlowmeterProvider>
      </UserDataProvider>
    </WebSocketProvider>
  );
};

export default RootLayout;
