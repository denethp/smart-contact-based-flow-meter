import { View } from "react-native";
import React from "react";
import Svg, { Path, G } from "react-native-svg";

const IconTemperature = ({ dark, width }) => {
  return (
    <Svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G stroke="#000" strokeWidth={width}>
        <Path
          opacity={1}
          d="M12 22a5.5 5.5 0 003.439-9.793c-.264-.211-.439-.521-.439-.86V5a3 3 0 10-6 0v6.348c0 .338-.175.648-.439.86A5.5 5.5 0 0012 22z"
        />
        <Path
          d="M12 14a2.5 2.5 0 100 5 2.5 2.5 0 000-5zm0 0V5"
          strokeLinecap="round"
        />
      </G>
    </Svg>
  );
};

export default IconTemperature;
