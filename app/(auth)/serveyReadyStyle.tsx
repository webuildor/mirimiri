import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import firestore from "@react-native-firebase/firestore";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from "react-native-reanimated";
import ProgressBar from "@/components/ProgressBar";

export default function serveyReadyStyle() {
  const [current, setCurrent] = useState(1);
  const router = useRouter();
  const { user } = useFirebaseAuth();
  const [selectedCheckButton, setSelectedCheckButton] = useState<string | null>(null);

  const buttonColor = useSharedValue(0); 

  const handlePress = (button: string) => {
    setSelectedCheckButton(button);
    buttonColor.value = 1; 
    setCurrent(2);
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      buttonColor.value,
      [0, 1],
      ["#c0c0c0", "#000000"] 
    ),
  }));

  const onPressIn = () => {
    if (selectedCheckButton) {
      buttonColor.value = withTiming(1, { duration: 200 });
    }
  };

  const onPressOut = () => {
    if (selectedCheckButton) {
      buttonColor.value = withTiming(0, { duration: 200 });
    }
  };

  const handleNextPress = async () => {
    if (selectedCheckButton) {
      try {
        
        await firestore()
          .collection("users")
          .doc(user.uid)
          .update({
            preparationStyle: selectedCheckButton,
          });

        
        router.replace('/(auth)/serveyComplete');
      } catch (error) {
        console.error("Firestore에 준비 스타일 저장 에러:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar current={current} total={2}/>
      <View style={styles.textBox}>
        <Text style={styles.title}>
          {user.displayName}님의{"\n"}
          <Text style={{ fontWeight: "bold" }}>준비 스타일</Text>은{"\n"}
          어떤 편인가요?
        </Text>
      </View>
      <View style={styles.checkButtonContainer}>
        <Pressable
          onPress={() => handlePress("relaxed")}
          style={[
            styles.checkButton,
            selectedCheckButton === "relaxed" && styles.selectedCheckButton,
          ]}
        >
          <Text style={styles.checkButtonText}>여유롭게</Text>
        </Pressable>

        <Pressable
          onPress={() => handlePress("onTime")}
          style={[
            styles.checkButton,
            selectedCheckButton === "onTime" && styles.selectedCheckButton,
          ]}
        >
          <Text style={styles.checkButtonText}>최소시간으로 딱맞게</Text>
        </Pressable>
      </View>

      <Animated.View style={[styles.button, animatedButtonStyle]}>
        <Pressable
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          onPress={handleNextPress}
          style={styles.pressableButton}
          disabled={!selectedCheckButton} 
        >
          <Text style={styles.buttonText}>다음</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  textBox: {
    marginTop: 100,
    width: "100%",
    height: 200,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 42,
    marginBottom: 40,
    fontFamily: 'SpoqaHanSans-Bold'
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'SpoqaHanSans-Bold'
  },
  checkButton: {
    width: "100%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    marginVertical: 10,
    backgroundColor: "#ffffff",
  },
  selectedCheckButton: {
    borderColor: "#000000",
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    fontFamily: 'SpoqaHanSans-Bold'
  },
  checkButtonContainer: {
    paddingHorizontal: 20,
  },
  button: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  pressableButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 24,
    color: "#ffffff",
    fontWeight: "bold",
    fontFamily: 'SpoqaHanSans-Bold'
  },
});
