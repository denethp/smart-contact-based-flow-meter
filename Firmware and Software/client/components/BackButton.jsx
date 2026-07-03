import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

function BackButton() {
  return (
    <View>
      <Svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#fff">
        <Path
          d="M244 400L100 256 244 112"
          fill="none"
          stroke="#212626"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="48px"
        />
        <Path
          d="M120 256L412 256"
          fill="none"
          stroke="#212626"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="48px"
        />
      </Svg>
    </View>
  );
}

export default BackButton;
