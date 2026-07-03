import { View } from "react-native";
import React from "react";
import Svg, { Path } from "react-native-svg";

const IconSpeed = () => {
  return (
    <View className="w-12 h-12">
      <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" fill="#000">
        <Path
          d="M14.703 5.572a12 12 0 00-12 12 12 12 0 00.69 3.965 10.747 10.747 0 01-.295-2.443A10.747 10.747 0 0113.844 8.348a10.747 10.747 0 015.982 1.826l2.14-2.14a12 12 0 00-7.263-2.462zm9.149 3.604a1.152 1.152 0 00-.72.281l-9.193 7.781c-.422.358-1.416 1.412-.002 2.826 1.415 1.415 2.469.42 2.827-.003l7.783-9.19c.358-.423.392-1.022 0-1.414a.947.947 0 00-.695-.281zm1.85 3.607l-2.022 2.022A10.747 10.747 0 0124.586 19h2.016a12 12 0 00.101-1.428 12 12 0 00-1.002-4.789z"
          transform="translate(0 -289.063) translate(0 289.063)"
          opacity={1}
          fill="#fff"
          fillOpacity={1}
          stroke="none"
          strokeWidth={10}
          strokeMiterlimit={4}
          strokeDasharray="none"
          strokeOpacity={1}
        />
      </Svg>
    </View>
  );
};

export default IconSpeed;
