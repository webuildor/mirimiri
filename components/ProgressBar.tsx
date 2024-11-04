

import React, { useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type ProgressBarProps = {
  current: number; 
  total: number; 
};

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const screenWidth = Dimensions.get("window").width; 
  const progress = total > 0 ? current / total : 0; 

  
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    
    animatedProgress.value = withTiming(progress * screenWidth, { duration: 500 });
  }, [progress, screenWidth]);

  
  const animatedStyle = useAnimatedStyle(() => ({
    width: animatedProgress.value,
  }));

  return (
    <View style={[styles.container, { width: screenWidth }]}>
      <Animated.View style={[styles.progress, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 10,
    backgroundColor: "#e0e0e0",
  },
  progress: {
    height: "100%",
    backgroundColor: "#000000",
  },
});

export default ProgressBar;
