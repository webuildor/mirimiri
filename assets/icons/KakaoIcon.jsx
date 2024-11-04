import * as React from "react";
import { View } from "react-native";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

const KakaoIcon = (props) => (
  <View>
    <Svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={64}
      height={64}
      fill="none"
      viewBox="0 0 64 64"
    >
      <G clipPath="url(#a)">
        <Path
          fill="#000"
          d="M32 0 
          A32 32 0 1 0 32 64 
          A32 32 0 1 0 32 0"
        />
        <Path
          fill="#F3DD24"
          d="M31.995 15.268c-10.138 0-18.359 6.385-18.359 14.28 0 4.895 3.183 9.179 8.017 11.78l-2.04 7.475a.745.745 0 0 0 1.163.776l8.934-5.926c.755.071 1.52.122 2.295.122 10.138 0 18.359-6.384 18.359-14.279 0-7.894-8.231-14.228-18.359-14.228"
        />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path fill="#fff" d="M0 0h64v64H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  </View>
);

export default KakaoIcon;
