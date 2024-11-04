import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <BottomSheetModalProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "black",
          tabBarInactiveTintColor: "gray",
          headerShadowVisible: true,
          tabBarStyle: {
            shadowColor: "#000", // 그림자 색상
            shadowOffset: { width: 0, height: 0 }, // 그림자 위치
            shadowOpacity: 0.2, // 그림자 불투명도
            shadowRadius: 10, // 그림자 크기
            elevation: 10, // 안드로이드 그림자 크기 조정
          },
          tabBarIconStyle: {
            top: 10,
          },
          tabBarLabelStyle: {
            fontSize: 14, // 텍스트 크기 설정
            fontFamily: "SpoqaHanSans-Bold", // 폰트 설정
            top: 10,
          },
        }}
      >
        <Tabs.Screen
          name="monthly"
          options={{
            title: "월간",
            tabBarIcon: ({ color }) => (
              <Ionicons name="calendar" size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="home"
          options={{
            title: "피드",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={28} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="setting"
          options={{
            title: "설정",
            tabBarIcon: ({ color }) => (
              <Ionicons name="settings" size={28} color={color} />
            ),
          }}
        />
      </Tabs>
    </BottomSheetModalProvider>
  );
}
