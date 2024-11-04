import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProgressBar from "@/components/ProgressBar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useFirebaseAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [current, setCurrent] = useState(1);
  const { email } = useLocalSearchParams();

  const confirmPasswordRef = useRef<TextInput>(null);

  
  const translateY = useSharedValue(0);
  const buttonTranslateY = useSharedValue(0);
  const buttonBackgroundColor = useSharedValue("#000000");

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => {
        const keyboardHeight = e.endCoordinates.height;
        buttonTranslateY.value = withTiming(-keyboardHeight, {
          duration: 300,
        });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        buttonTranslateY.value = withTiming(0, { duration: 300 });
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleFocus = (field: string) => {
    setFocusedInput(field);
    translateY.value = withTiming(-160, { duration: 300 });
  };

  const handleBlur = (field: string) => {
    setFocusedInput(null);
    translateY.value = withTiming(0, { duration: 300 });
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    const isValid = text.length >= 6;
    setIsPasswordValid(isValid);

    if (text === "" && confirmPassword === "") {
      setCurrent(1);
    } else if (isValid) {
      setCurrent(1.5);
    } else {
      setCurrent(1);
    }
  };

  const handleConfirmPasswordChange = (text: string) => {
    setConfirmPassword(text);

    if (password === "" && text === "") {
      setCurrent(1);
    } else if (text === password && password.length >= 6) {
      setConfirmPasswordError("");
      setCurrent(2);
    } else {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      setCurrent(1.5);
    }
  };

  const isButtonEnabled =
    isPasswordValid &&
    confirmPassword === password &&
    confirmPassword.length >= 6;

  const handleSignUp = async () => {
    try {
      await signUp(email as string, password); 
      console.log("회원가입 성공", "회원가입이 완료되었습니다.");
    } catch (e: any) {
      console.error("회원가입 에러:", e.message);
      console.log("회원가입 실패", e.message);
    }
  };

  const handlePressIn = () => {
    buttonBackgroundColor.value = withTiming("#333333", { duration: 200 });
  };

  const handlePressOut = () => {
    buttonBackgroundColor.value = withTiming("#000000", { duration: 200 });
  };

  const fieldWrapperAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonTranslateY.value }],
    backgroundColor: buttonBackgroundColor.value,
  }));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ProgressBar current={current} total={3} />
        <Animated.View
          style={[
            styles.fieldWrapper,
            { marginTop: 200 },
            fieldWrapperAnimatedStyle,
          ]}
        >
          <Text style={styles.label}>비밀번호 입력</Text>
          <View
            style={[
              styles.inputContainer,
              focusedInput === "password" && styles.inputContainerFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={validatePassword}
              placeholder="6자리 이상 입력해주세요"
              secureTextEntry={true}
              placeholderTextColor="#aaa"
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              onSubmitEditing={() => confirmPasswordRef.current?.focus()}
              returnKeyType="next"
            />
            {password.length > 0 && (
              <Ionicons
                name={isPasswordValid ? "checkmark-circle" : "close-circle"}
                size={32}
                color="#000000"
                style={styles.icon}
              />
            )}
          </View>
          {!isPasswordValid && password.length > 0 && (
            <Text style={styles.errorText}>
              비밀번호는 6자리 이상이어야 합니다.
            </Text>
          )}
        </Animated.View>

        <Animated.View style={[styles.fieldWrapper, fieldWrapperAnimatedStyle]}>
          <Text style={styles.label}>비밀번호 확인</Text>
          <View
            style={[
              styles.inputContainer,
              focusedInput === "confirmPassword" &&
                styles.inputContainerFocused,
            ]}
          >
            <TextInput
              style={styles.input}
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              placeholder="다시 한번 더 입력해주세요"
              secureTextEntry={true}
              placeholderTextColor="#aaa"
              onFocus={() => handleFocus("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              returnKeyType="done"
              ref={confirmPasswordRef}
            />
            {confirmPassword.length > 0 && (
              <Ionicons
                name={
                  confirmPassword === password && confirmPassword.length >= 6
                    ? "checkmark-circle"
                    : "close-circle"
                }
                size={32}
                color="#000000"
                style={styles.icon}
              />
            )}
          </View>
          {confirmPasswordError.length > 0 && (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          )}
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <Pressable
            style={[styles.button, !isButtonEnabled && styles.buttonDisabled]}
            disabled={!isButtonEnabled}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleSignUp}
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
  fieldWrapper: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 36,
    marginBottom: 10,
    marginLeft: 20,
    color: "#000",
    fontFamily: 'SpoqaHanSans-Bold'
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
  },
  input: {
    flex: 1,
    height: 80,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: "transparent",
    fontFamily: 'SpoqaHanSans-Medium',
    textAlign: 'center'
  },
  icon: {
    position: "absolute",
    right: 20,
  },
  errorText: {
    marginTop: 12,
    marginLeft: 20,
    fontSize: 14,
    color: "red",
    fontFamily: 'SpoqaHanSans-Medium'
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 80,
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
  inputContainerFocused: {
    borderColor: "#000000",
  },
});
