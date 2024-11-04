import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
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

export default function SignIn() {
  const router = useRouter();
  const { email } = useLocalSearchParams(); 
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [current, setCurrent] = useState(1);

  const buttonTranslateY = useSharedValue(0);
  const buttonBackgroundColor = useSharedValue("#000000");
  const emailLabelBackgroundColor = useSharedValue("#e0e0e0");
  const emailLabelTextColor = useSharedValue("#a0a0a0");
  const passwordLabelBackgroundColor = useSharedValue("#e0e0e0");
  const passwordLabelTextColor = useSharedValue("#a0a0a0");

  const { signIn } = useFirebaseAuth();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", (event) => {
      buttonTranslateY.value = withTiming(-event.endCoordinates.height, { duration: 300 });
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      buttonTranslateY.value = withTiming(0, { duration: 300 });
    });
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleFocus = (field: string) => {
    setIsFocused(field);
    if (field === "email") {
      emailLabelBackgroundColor.value = withTiming("#000000", { duration: 200 });
      emailLabelTextColor.value = withTiming("#ffffff", { duration: 200 });
    } else if (field === "password") {
      passwordLabelBackgroundColor.value = withTiming("#000000", { duration: 200 });
      passwordLabelTextColor.value = withTiming("#ffffff", { duration: 200 });
    }
  };

  const handleBlur = (field: string) => {
    setIsFocused(null);
    if (field === "email") {
      emailLabelBackgroundColor.value = withTiming("#e0e0e0", { duration: 200 });
      emailLabelTextColor.value = withTiming("#a0a0a0", { duration: 200 });
    } else if (field === "password") {
      passwordLabelBackgroundColor.value = withTiming("#e0e0e0", { duration: 200 });
      passwordLabelTextColor.value = withTiming("#a0a0a0", { duration: 200 });
    }
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    setIsPasswordValid(text.length >= 6);
    setCurrent(text.length >= 6 ? 2 : 1);
  };

  const handlePressIn = () => {
    buttonBackgroundColor.value = withTiming("#333333", { duration: 200 });
  };

  const handlePressOut = () => {
    buttonBackgroundColor.value = withTiming("#000000", { duration: 200 });
  };

  const handleLogin = async () => {
    try {
      await signIn(email as string, password);
    } catch (error) {
      Alert.alert("로그인 실패", "이메일 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: buttonTranslateY.value }],
    backgroundColor: buttonBackgroundColor.value,
  }));

  const emailLabelAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: emailLabelBackgroundColor.value,
  }));

  const emailLabelTextAnimatedStyle = useAnimatedStyle(() => ({
    color: emailLabelTextColor.value,
  }));

  const passwordLabelAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: passwordLabelBackgroundColor.value,
  }));

  const passwordLabelTextAnimatedStyle = useAnimatedStyle(() => ({
    color: passwordLabelTextColor.value,
  }));

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <ProgressBar current={current} total={3} />

        <View style={[styles.inputFields, {marginTop: 100}]}>
          <View style={[styles.inputContainer, isFocused === "email" && styles.inputContainerFocused, {backgroundColor: '#f4f4f4'}]}>
            <Animated.View style={[styles.labelContainer, emailLabelAnimatedStyle]}>
              <Animated.Text style={[styles.labelText, emailLabelTextAnimatedStyle]}>
                Email
              </Animated.Text>
            </Animated.View>
            <TextInput
              style={[styles.input, {color: '#aaa'}]}
              value={email as string}
              placeholder="이메일을 입력하세요"
              placeholderTextColor="#aaa"
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              editable={false}
            />
          </View>

          <View style={[styles.inputContainer, isFocused === "password" && styles.inputContainerFocused]}>
            <Animated.View style={[styles.labelContainer, passwordLabelAnimatedStyle]}>
              <Animated.Text style={[styles.labelText, passwordLabelTextAnimatedStyle]}>
                PW
              </Animated.Text>
            </Animated.View>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={validatePassword}
              placeholder="비밀번호를 입력하세요"
              secureTextEntry={true}
              placeholderTextColor="#aaa"
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              returnKeyType="done"
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
        </View>

        <Animated.View style={[styles.buttonContainer, buttonAnimatedStyle]}>
          <Pressable
            style={[styles.button, !isPasswordValid && styles.buttonDisabled]}
            disabled={!isPasswordValid}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>로그인</Text>
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
  inputFields: {
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
    width: '100%',
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ddd",
    borderRadius: 100,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 20,
    alignSelf: 'center'
  },
  inputContainerFocused: {
    borderColor: "#000000",
  },
  labelContainer: {
    width: 80,
    height: 30,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20
  },
  labelText: {
    fontSize: 16,
    fontFamily: 'SpoqaHanSans-Bold'
  },
  input: {
    flex: 1,
    height: 80,
    fontSize: 16,
    backgroundColor: "transparent",
    fontFamily: 'SpoqaHanSans-Medium'
  },
  icon: {
    position: "absolute",
    right: 20,
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
});
