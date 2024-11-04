import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";

export default function Index() {
  const backgroundImage = require("../assets/images/startPageBg.png");
  const { width, height } = Dimensions.get("window");

  const router = useRouter();

  const translateX = useSharedValue(0);

  
  const [isPressed, setIsPressed] = useState(false);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(140, { duration: 10000 }),
        withTiming(-140, { duration: 10000 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <ImageBackground
          source={backgroundImage}
          style={[styles.background, { width: width * 2, height: height }]}
        >
          <BlurView intensity={30} style={StyleSheet.absoluteFill} />
          <View style={styles.darkOverlay} />
        </ImageBackground>
      </Animated.View>

      <View style={styles.titleBox}>
        <Text style={styles.title}>#mirimiri</Text>
        <Text style={styles.subtitle}>일간, 주간, 월간 모두 관리 가능한</Text>
        <Text style={styles.subtitle}>나만의 맞춤형 플래너</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.button,
            {
              backgroundColor: isPressed ? "#2b2b2b" : "#000000", 
            },
          ]}
          onPress={() => router.push("/(auth)/authMain")}
          onPressIn={() => setIsPressed(true)} 
          onPressOut={() => setIsPressed(false)}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: isPressed ? "#dddddd" : "#ffffff", 
              },
            ]}
          >
            시작하기
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  background: {
    justifyContent: "center",
    alignItems: "center",
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  titleBox: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    bottom: 0
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: 'SpoqaHanSans-Bold'
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "200",
    marginVertical: 2.5,
    fontFamily: 'SpoqaHanSans-Thin'
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    backgroundColor: "#000000",
  },
  button: {
    width: "100%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
