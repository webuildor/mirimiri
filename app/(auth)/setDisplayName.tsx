import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import ProgressBar from "@/components/ProgressBar";
import { useRouter } from "expo-router";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext"; 

export default function SetDisplayName() {
  const [current, setCurrent] = useState(2);
  const [displayName, setDisplayName] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState(""); 
  const [isValid, setIsValid] = useState(false); 
  const buttonPosition = useSharedValue(0);
  const buttonBackgroundColor = useSharedValue("#000000");
  const { updateDisplayName, user } = useFirebaseAuth(); 
  const router = useRouter();

  
  const validateDisplayName = (name: string) => {
    const startsWithLetterRegex = /^[A-Za-z가-힣]/; 
    const koreanRegex = /^[가-힣0-9]{2,8}$/; 
    const alphanumericRegex = /^[A-Za-z][A-Za-z0-9]{2,15}$/; 
    const noSpecialCharsOrWhitespace = /^[A-Za-z가-힣0-9]+$/; 

    if (!startsWithLetterRegex.test(name)) {
      setError("첫 글자는 숫자나 공백이 될 수 없습니다.");
      setIsValid(false);
      setCurrent(2);
    } else if (!noSpecialCharsOrWhitespace.test(name)) {
      setError("특수문자와 공백은 포함할 수 없습니다.");
      setIsValid(false);
      setCurrent(2);
    } else if (!koreanRegex.test(name) && !alphanumericRegex.test(name)) {
      setError("닉네임은 한글 2~8자 또는 영어 3~16자여야 합니다.");
      setIsValid(false);
      setCurrent(2);
    } else {
      setError("");
      setIsValid(true);
      setCurrent(3);
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
      buttonPosition.value = withTiming(event.endCoordinates.height, { duration: 300 });
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      buttonPosition.value = withTiming(0, { duration: 300 });
    });
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    bottom: buttonPosition.value,
    backgroundColor: buttonBackgroundColor.value,
  }));

  const handleDisplayNameChange = (text: string) => {
    setDisplayName(text);
  };

  const handleDisplayNameSubmit = () => {
    validateDisplayName(displayName); 
  };

  const handlePressIn = () => {
    buttonBackgroundColor.value = withTiming("#333333", { duration: 200 });
  };

  const handlePressOut = () => {
    buttonBackgroundColor.value = withTiming("#000000", { duration: 200 });
  };

  
  const handleUpdateDisplayName = async () => {
    if (isValid) {
      try {
        console.log("Updating display name:", displayName); 
        await updateDisplayName(displayName); 
        router.push("/(auth)/serveyMain"); 
      } catch (error) {
        console.error("Nickname update error:", error); 
        setError("닉네임 업데이트 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ProgressBar current={current} total={3} />

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            <Text style={{ fontWeight: "bold" }}>호칭</Text>을 정해주세요{": )"}
          </Text>
          <Text style={styles.subtitle}>
            본명이나 닉네임을 입력해주세요.{"\n"}
            앞으로 정해주신 호칭으로 불러드릴게요.
          </Text>
        </View>

        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
          ]}
        >
          <TextInput
            style={styles.input}
            placeholder="숫자 포함 한글 2~8자 또는 영어 3~16자"
            value={displayName}
            onChangeText={handleDisplayNameChange}
            placeholderTextColor="#aaa"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={handleDisplayNameSubmit} 
            autoCapitalize="none"
          />
          {/* 유효성에 따라 아이콘 표시 */}
          {displayName.length > 0 && (
            <Ionicons
              name={isValid ? "checkmark-circle" : "close-circle"}
              size={32}
              color="#000000"
              style={styles.icon}
            />
          )}
        </View>

        {/* 에러 메시지 표시 */}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Animated.View style={[styles.button, animatedButtonStyle]}>
          <Pressable
            style={[styles.pressableButton, !isValid && styles.buttonDisabled]}
            disabled={!isValid}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleUpdateDisplayName} 
          >
            <Text style={styles.buttonText}>다음</Text>
          </Pressable>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  textContainer: {
    paddingHorizontal: 20,
    marginTop: 60,
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    marginBottom: 20,
    fontFamily: 'SpoqaHanSans-Thin'
  },
  subtitle: {
    fontSize: 20,
    marginTop: 12,
    fontFamily: 'SpoqaHanSans-Thin'
  },
  inputContainer: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 100,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 40,
  },
  inputContainerFocused: {
    borderColor: "#000000",
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: "#333",
    backgroundColor: "transparent",
    textAlign: "center",
    fontFamily: 'SpoqaHanSans-Medium'
  },
  icon: {
    position: "absolute",
    right: 20,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginTop: 8,
    marginLeft: 60,
    marginHorizontal: 20,
    fontFamily: 'SpoqaHanSans-Bold'
  },
  button: {
    width: "100%",
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  pressableButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#c0c0c0",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    fontFamily: 'SpoqaHanSans-Bold'
  },
});
