import { StyleSheet, TouchableOpacity, View } from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Authlayout() {
  const router = useRouter();

  const BackButtonIcon = () => (
    <TouchableOpacity onPress={() => router.back()}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  );

  const NoButtonIcon = () => <View></View>;

  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontWeight: "normal",
          color: "black",
        },
        headerShadowVisible: false,
        headerLeft: BackButtonIcon,
      }}
    >
      <Stack.Screen
        name="authMain"
        options={{
          title: "로그인",
          headerTitleStyle: {
            fontFamily: "SpoqaHanSans-Thin",
            fontSize: 24,
          },
        }}
      />
      <Stack.Screen
        name="signUp"
        options={{
          title: "회원가입",
          headerTitleStyle: {
            fontFamily: "SpoqaHanSans-Thin",
            fontSize: 24,
          },
        }}
      />
      <Stack.Screen
        name="signIn"
        options={{
          title: "로그인",
          headerTitleStyle: {
            fontFamily: "SpoqaHanSans-Thin",
            fontSize: 24,
          },
        }}
      />
      <Stack.Screen
        name="setDisplayName"
        options={{
          title: "회원가입",
          headerTitleStyle: {
            fontFamily: "SpoqaHanSans-Thin",
            fontSize: 24,
          },
        }}
      />
      <Stack.Screen name="serveyMain" options={{ headerShown: false }} />
      <Stack.Screen
        name="serveyReadyTime"
        options={{
          title: "설문조사",
          headerLeft: NoButtonIcon,
          headerTitleStyle: {
            fontFamily: "SpoqaHanSans-Thin",
            fontSize: 24,
          },
        }}
      />
      <Stack.Screen
        name="serveyReadyStyle"
        options={{
          title: "설문조사",
          headerTitleStyle: {
            fontFamily: "SpoqaHanSans-Thin",
            fontSize: 24,
          },
        }}
      />
      <Stack.Screen
        name="serveyComplete"
        options={{
          title: "설문조사",
          headerLeft: NoButtonIcon,
          headerTitleStyle: {
            fontFamily: "SpoqaHanSans-Thin",
            fontSize: 24,
          },
        }}
      />
    </Stack>
  );
}
