import * as React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const GoogleIcon = (props) => (
  <View>
    <Svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width={64}
      height={64}
      viewBox="0 0 64 64"
      fill="none"
      
    >
      {/* 원형 배경 */}
      <Path
        fill="#000" // 배경 색상: #ededed
        d="M32 0 A32 32 0 1 0 32 64 A32 32 0 1 0 32 0"
      />

      {/* Google 로고 경로 (중앙 위치 조정) */}
      <Path
        x={-4}
        y={-2}
        fill="#4285F4"
        fillRule="evenodd"
        d="M50.693 34.475c0-1.003-.09-1.968-.257-2.895h-13.33v5.475h7.617a6.51 6.51 0 0 1-2.825 4.272v3.552h4.575c2.676-2.464 4.22-6.093 4.22-10.404Z"
        clipRule="evenodd"
      />
      <Path
        x={-4}
        y={-2}
        fill="#34A853"
        fillRule="evenodd"
        d="M37.105 48.307c3.822 0 7.026-1.267 9.368-3.429l-4.575-3.551c-1.267.85-2.888 1.351-4.793 1.351-3.686 0-6.806-2.49-7.92-5.835h-4.728v3.667c2.329 4.626 7.116 7.797 12.648 7.797Z"
        clipRule="evenodd"
      />
      <Path
        x={-4}
        y={-2}
        fill="#FBBC05"
        fillRule="evenodd"
        d="M29.186 36.843a8.51 8.51 0 0 1-.444-2.69c0-.932.16-1.84.444-2.688v-3.668h-4.729a14.149 14.149 0 0 0-1.505 6.357c0 2.284.547 4.445 1.505 6.356l4.729-3.667Z"
        clipRule="evenodd"
      />
      <Path
        x={-4}
        y={-2}
        fill="#EA4335"
        fillRule="evenodd"
        d="M37.105 25.63c2.079 0 3.944.713 5.411 2.116l4.06-4.06C44.124 21.402 40.92 20 37.106 20c-5.533 0-10.32 3.172-12.649 7.797l4.729 3.668c1.113-3.346 4.233-5.836 7.92-5.836Z"
        clipRule="evenodd"
      />
    </Svg>
  </View>
);

export default GoogleIcon;
