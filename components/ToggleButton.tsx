import React from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

interface ToggleButtonProps {
  onToggle: (isDaily: boolean) => void; 
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ onToggle }) => {
  const [isDaily, setIsDaily] = React.useState(true); 
  const translateX = useSharedValue(0); 
  const opacity = useSharedValue(1); 

  const handleToggle = () => {
    opacity.value = 0; 
    setTimeout(() => {
      const newState = !isDaily;
      setIsDaily(newState);
      onToggle(newState); 
      translateX.value = newState ? 0 : 52.5; 
      opacity.value = 1; 
    }, 300);
  };

  const animatedThumbStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withTiming(translateX.value, {
          duration: 300,
          easing: Easing.inOut(Easing.ease),
        }),
      },
    ],
  }));

  const animatedContentStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, { duration: 300 }),
  }));

  const leftLabelStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isDaily ? 0 : 1, { duration: 300 }),
  }));

  const rightLabelStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isDaily ? 1 : 0, { duration: 300 }),
  }));

  return (
    <TouchableWithoutFeedback onPress={handleToggle}>
      <View style={styles.trackbar}>
        {/* Thumb */}
        <Animated.View style={[styles.thumb, animatedThumbStyle]}>
          <Animated.View style={[styles.content, animatedContentStyle]}>
            <Ionicons
              name="checkmark-circle"
              size={20} 
              color="#000"
            />
            <Text style={styles.thumbText}>{isDaily ? "일간" : "주간"}</Text>
          </Animated.View>
        </Animated.View>

        {/* Trackbar Labels */}
        <View style={styles.labelContainer}>
          <Animated.Text style={[styles.label, leftLabelStyle]}>
            일간
          </Animated.Text>
          <Animated.Text style={[styles.label, rightLabelStyle]}>
            주간
          </Animated.Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  trackbar: {
    width: 120, 
    height: 35, 
    backgroundColor: "#000", 
    borderRadius: 20,
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  thumb: {
    width: 60, 
    height: 28, 
    backgroundColor: "#fff", 
    borderRadius: 14,
    position: "absolute",
    top: 3.5, 
    left: 3.5, 
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumbText: {
    fontSize: 16, 
    fontWeight: "bold",
    color: "#000", 
    fontFamily: 'SpoqaHanSans-Bold',
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16, 
    color: "#fff", 
    fontFamily: 'SpoqaHanSans-Bold',
  },
});

export default ToggleButton;
