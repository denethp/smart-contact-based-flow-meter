import * as React from "react";
import Svg, { G, Path } from "react-native-svg";

function IconSettings({ dark }) {
  return (
    <Svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G
        stroke={`${dark ? "#212626" : "#f5f5f5"}`}
        strokeWidth={`${dark ? 0.92 : 0.82}`}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M18.889 10.25a2 2 0 01-1.71-3l.12-.21a1.87 1.87 0 00-.79-2.63v0a2.16 2.16 0 00-2.79.84v0a2 2 0 01-3.42 0 2.16 2.16 0 00-2.79-.84v0a1.87 1.87 0 00-.79 2.63l.12.21a2 2 0 01-1.71 3 2.07 2.07 0 00-2.08 1.66 2 2 0 002 2.34h.12a2 2 0 011.71 3l-.05.08a2.05 2.05 0 00.72 2.76v0a2 2 0 002.71-.7l.02-.14a2 2 0 013.42 0l.07.14a2 2 0 002.72.7 2 2 0 00.7-2.71l-.06-.11a2 2 0 011.71-3h.12a2 2 0 002-2.34 2.07 2.07 0 00-2.07-1.68v0z" />
        <Path d="M12 14.79a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
      </G>
    </Svg>
  );
}

export default IconSettings;
