import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Pressable,
  Text,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import ProgressBar from "@/components/ProgressBar";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import NaverIcon from "@/assets/icons/NaverIcon";
import KakaoIcon from "@/assets/icons/KakaoIcon";
import AppleIcon from "@/assets/icons/AppleIcon";
import GoogleIcon from "@/assets/icons/GoogleIcon";
import firestore from "@react-native-firebase/firestore";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AuthMain() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [current, setCurrent] = useState(0);

  const buttonPosition = useSharedValue(0);
  const buttonBackgroundColor = useSharedValue("#000000");
  const inputPosition = useSharedValue(0);
  const titlePosition = useSharedValue(0);
  const borderColor = useSharedValue("#e0e0e0");
  const labelBackgroundColor = useSharedValue("#e0e0e0");
  const labelColor = useSharedValue("#a0a0a0");

  const router = useRouter();

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleBlur = () => {
    const valid = validateEmail(email);
    if (!valid) {
      setError("유효한 이메일 형식을 입력하세요.");
      setIsValid(false);
    } else {
      setError("");
      setIsValid(true);
      setCurrent(1); 
    }
    setIsFocused(false);
    inputPosition.value = withTiming(0, { duration: 200 });
    titlePosition.value = withTiming(0, { duration: 200 });
    borderColor.value = withTiming("#e0e0e0", { duration: 200 });
    labelBackgroundColor.value = withTiming("#e0e0e0", { duration: 200 });
    labelColor.value = withTiming("#a0a0a0", { duration: 200 });
  };

  const handleFocus = () => {
    setIsFocused(true);
    inputPosition.value = withTiming(-100, { duration: 200 });
    titlePosition.value = withTiming(-100, { duration: 200 });
    borderColor.value = withTiming("#000000", { duration: 200 });
    labelBackgroundColor.value = withTiming("#000000", { duration: 200 });
    labelColor.value = withTiming("#ffffff", { duration: 200 });
  };

  const handlePressIn = () => {
    buttonBackgroundColor.value = withTiming("#333333", { duration: 200 });
  };

  const handlePressOut = () => {
    buttonBackgroundColor.value = withTiming("#000000", { duration: 200 });
  };

  const handleSubmit = async () => {
    const valid = validateEmail(email);
    if (valid) {
      setCurrent(1);

     
      const userDoc = await firestore()
        .collection("users")
        .where("email", "==", email)
        .get();

      if (!userDoc.empty) {
        router.push(`/(auth)/signIn?email=${email}`);
      } else {
        router.push(`/(auth)/signUp?email=${email}`);
      }
    } else {
      setCurrent(0.5);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    
    let newCurrent = 0;
    if (text.includes("@")) {
      newCurrent += 0.25;
    }
    if (text.includes(".")) {
      newCurrent += 0.25;
    }
    setCurrent(newCurrent);
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (event) => {
        buttonPosition.value = withTiming(event.endCoordinates.height, {
          duration: 300,
        });
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        buttonPosition.value = withTiming(0, { duration: 300 });
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    bottom: buttonPosition.value,
    backgroundColor: buttonBackgroundColor.value,
  }));

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: inputPosition.value }],
  }));

  const animatedTitleStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: titlePosition.value }],
  }));

  const animatedBorderColor = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const animatedLabelBackgroundColor = useAnimatedStyle(() => ({
    backgroundColor: labelBackgroundColor.value,
  }));

  const animatedLabelColor = useAnimatedStyle(() => ({
    color: labelColor.value,
  }));

  const animatedErrorStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: inputPosition.value }],
  }));

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ProgressBar current={current} total={3} />
          <Animated.View style={[styles.titleBox, animatedTitleStyle]}>
            <Text style={styles.title}>
              먼저 <Text style={{ fontWeight: "bold" }}>로그인</Text>이 {"\n"}
              필요해요 {': )'}
            </Text>
          </Animated.View>
          <Animated.View
            style={[
              styles.inputContainer,
              animatedInputStyle,
              animatedBorderColor,
            ]}
          >
            <Animated.View
              style={[styles.labelContainer, animatedLabelBackgroundColor]}
            >
              <Animated.Text style={[styles.labelText, animatedLabelColor]}>
                ID
              </Animated.Text>
            </Animated.View>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={handleEmailChange}
              placeholder="이메일을 입력해주세요"
              placeholderTextColor="#c0c0c0"
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={handleBlur}
              onFocus={handleFocus}
            />
            {isValid ? (
              <Ionicons
                name="checkmark-circle"
                size={32}
                color="#000"
                style={styles.icon}
              />
            ) : error ? (
              <Ionicons
                name="close-circle"
                size={32}
                color="#000"
                style={styles.icon}
              />
            ) : null}
          </Animated.View>
          {error ? (
            <Animated.Text style={[styles.errorText, animatedErrorStyle]}>
              {error}
            </Animated.Text>
          ) : null}

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>간편 로그인</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.iconsContainer}>
            <NaverIcon />
            <KakaoIcon />
            <AppleIcon />
            <GoogleIcon />
          </View>
        </View>
      </TouchableWithoutFeedback>

      <AnimatedPressable
        style={[
          styles.button,
          animatedButtonStyle,
          email ? {} : styles.buttonDisabled,
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={!email}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>다음</Text>
      </AnimatedPressable>
    </KeyboardAvoidingView>
  );
}

const screenWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  titleBox: {
    paddingHorizontal: 20,
    paddingTop: 160,
    paddingBottom: 80,
  },
  title: {
    fontSize: 48,
    fontFamily: 'SpoqaHanSans-Thin'
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 100,
    backgroundColor: "#ffffff",
    width: screenWidth - 40,
    alignSelf: "center",
    paddingHorizontal: 20,
    borderWidth: 2,
    height: 80,
  },
  labelContainer: {
    borderRadius: 100,
    width: 60,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  labelText: {
    fontSize: 16,
    fontFamily: 'SpoqaHanSans-Bold'
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    fontFamily: 'SpoqaHanSans-Medium'
  },
  icon: {
    marginLeft: 10,
  },
  errorText: {
    color: "red",
    marginVertical: 12,
    textAlign: "center",
    fontFamily: 'SpoqaHanSans-Medium'
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 20,
  },
  line: {
    height: 1,
    backgroundColor: "#e0e0e0",
    width: "35%",
    marginHorizontal: 2.5,
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#a0a0a0",
    fontSize: 16,
    fontFamily: 'SpoqaHanSans-Medium'
  },
  button: {
    width: "100%",
    height: 80,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: 'SpoqaHanSans-Bold'
  },
  buttonDisabled: {
    backgroundColor: "#c0c0c0",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
