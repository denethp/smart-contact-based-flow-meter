import Svg, { Path } from "react-native-svg";

function IconRange({ width }) {
  return (
    <Svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        d="M5 12a7 7 0 017-7m4.5 2.5L12 12m10 0c0 5.523-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2s10 4.477 10 10zm-9 0a1 1 0 11-2 0 1 1 0 012 0z"
        stroke="#000"
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default IconRange;
