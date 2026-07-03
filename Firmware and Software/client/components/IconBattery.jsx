import Svg, { Path } from "react-native-svg";

function IconBattery({ width }) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={width}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-battery-vertical-charging"
    >
      <Path d="M0 0h24v24H0z" stroke="none" />
      <Path d="M7 18V7a2 2 0 012-2h.5a.5.5 0 00.5-.5.5.5 0 01.5-.5h3a.5.5 0 01.5.5.5.5 0 00.5.5h.5a2 2 0 012 2v11a2 2 0 01-2 2H9a2 2 0 01-2-2" />
      <Path d="M12.667 8L10 12h4l-2.667 4" />
    </Svg>
  );
}

export default IconBattery;
