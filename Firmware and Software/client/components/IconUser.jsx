import Svg, { G, Circle, Path } from "react-native-svg";

function IconUser() {
  return (
    <Svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <G stroke="#fff" strokeWidth={0.72}>
        <Circle cx={12} cy={6} r={4} />
        <Path
          opacity={0.5}
          d="M20 17.5c0 2.485 0 4.5-8 4.5s-8-2.015-8-4.5S7.582 13 12 13s8 2.015 8 4.5z"
        />
      </G>
    </Svg>
  );
}

export default IconUser;
