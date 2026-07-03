import { StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const IconHazard = () => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 128 128"
      enableBackground="new 0 0 512 512"
    >
      <Path
        fill="#fb923c"
        d="M113.37 114.23H14.63c-8.33 0-13.41-9.15-9.01-16.22l49.37-79.25c4.15-6.67 13.86-6.67 18.01 0l49.37 79.25c4.41 7.07-.67 16.22-9 16.22z"
      />
      <Path
        d="M64 42.54c-5.48 0-9.76 4.74-9.2 10.19l2.29 22.34c.36 3.54 3.35 6.24 6.91 6.24s6.55-2.69 6.91-6.24l2.29-22.34c.56-5.45-3.72-10.19-9.2-10.19zm0 46.07a7.47 7.47 0 107.47 7.47c0-4.12-3.35-7.47-7.47-7.47z"
        className="hovered-path"
        fill="#212626"
      />
    </Svg>
  );
};

export default IconHazard;

const styles = StyleSheet.create({});
