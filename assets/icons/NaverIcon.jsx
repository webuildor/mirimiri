import * as React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg";

const NaverIcon = (props) => (
  <View>
    <Svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
    >
      <G clipPath="url(#a)">
        <Path
          fill="#000"
          d="M32 0 
          A32 32 0 1 0 32 64 
          A32 32 0 1 0 32 0"
        />
        <Path
          fill="#45B35C"
          d="M36.054 20.817v11.79l-8.078-11.79h-8.73v23.366h8.69v-11.79l8.077 11.79h8.73V20.817h-8.689Z"
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

export default NaverIcon;
