import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { Stack } from "expo-router";
import { FirebaseAuthProvider } from "@/contexts/FirebaseAuthContext";
import * as Font from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth, { signOut } from '@react-native-firebase/auth';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [hasError, setHasError] = useState(false);

  const loadFonts = async () => {
    try {
      await Font.loadAsync({
        "SpoqaHanSans-Bold": require("@/assets/fonts/SpoqaHanSansNeo-Bold.ttf"),
        "SpoqaHanSans-Light": require("@/assets/fonts/SpoqaHanSansNeo-Light.ttf"),
        "SpoqaHanSans-Medium": require("@/assets/fonts/SpoqaHanSansNeo-Medium.ttf"),
        "SpoqaHanSans-Regular": require("@/assets/fonts/SpoqaHanSansNeo-Regular.ttf"),
        "SpoqaHanSans-Thin": require("@/assets/fonts/SpoqaHanSansNeo-Thin.ttf"),
      });
    } catch (e) {
      console.error("폰트 로드 실패:", e); 
      setHasError(true);
      throw e; 
    }
  };

  
  const loadResourcesAndData = async () => {
    try {
      setLoadingText("폰트 설치 중...");
      await loadFonts(); 

      setLoadingText("로딩 중...");
      await new Promise((resolve) => setTimeout(resolve, 300)); 

      setLoadingText("앱 초기화 중...");
      await new Promise((resolve) => setTimeout(resolve, 500)); 

      setLoadingText("데이터 가져오는 중...");
      await new Promise((resolve) => setTimeout(resolve, 2000)); 
    } catch (e) {
      console.warn("리소스 로드 중 문제 발생:", e); 
      setHasError(true);
    } finally {
      setIsReady(true);
      await SplashScreen.hideAsync(); 
    }
  };

  
  useEffect(() => {
    loadResourcesAndData();
  }, []);

  
  if (!isReady) {
    return (
      <View style={styles.splashContainer}>
        <Text style={styles.title}>#mirimiri</Text>
        <Text style={styles.subtitle}>일간, 주간, 월간 모두 관리 가능한</Text>
        <Text style={styles.subtitle}>나만의 맞춤형 플래너</Text>

        <View style={styles.loadingBox}>
          <ActivityIndicator
            size="small"
            style={{ marginRight: 10 }}
            color="#000"
          />
          <Text style={styles.loadingText}>{loadingText}</Text>
        </View>
        {hasError && (
          <Text style={styles.errorText}>로딩 중 문제가 발생했습니다.</Text>
        )}
      </View>
    );
  }

  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FirebaseAuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </FirebaseAuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    bottom: 50,
  },
  loadingText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "SpoqaHanSans-Thin",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "SpoqaHanSans-Bold",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "200",
    marginVertical: 2.5,
    fontFamily: "SpoqaHanSans-Thin",
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginTop: 10,
  },
});
