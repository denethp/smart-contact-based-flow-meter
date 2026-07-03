import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";
const IconFlow = () => {
  return (
    <Svg viewBox="-5 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path fill="#fff" fillOpacity={0.01} d="M0 0H48V48H0z" />
      <Path fill="#fff" fillOpacity={0.01} d="M0 0H48V58H0z" />
      <Path
        d="M34.023 6.69A19.908 19.908 0 0024 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-3.627-.966-7.03-2.654-9.962"
        stroke="#000"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M31.95 16.05S28.562 25.095 27 26.657A4 4 0 0121.343 21c1.562-1.562 10.607-4.95 10.607-4.95z"
        fill="#2F88FF"
        stroke="#000"
        strokeWidth={2.088}
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default IconFlow;

const styles = StyleSheet.create({});
