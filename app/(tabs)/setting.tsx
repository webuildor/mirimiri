import { StyleSheet, Text, View, Pressable, SafeAreaView, Alert } from "react-native";
import React from "react";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Setting() {
  const { signOut, user, updateUserEmail, sendPasswordReset, deleteAccount } = useFirebaseAuth();
  const router = useRouter();

  const handleEmailChange = async () => {
    if (!user?.email) return;
    Alert.prompt(
      "이메일 변경",
      "새로운 이메일을 입력하세요",
      [
        { text: "취소", style: "cancel" },
        {
          text: "변경",
          onPress: async (newEmail?: string) => {
            if (!newEmail) return;
            try {
              await updateUserEmail(newEmail);
              Alert.alert("성공", "이메일이 변경되었습니다");
            } catch (error: any) {
              Alert.alert("오류", error.message);
            }
          }
        }
      ],
      "plain-text",
      user.email
    );
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordReset(user.email);
      Alert.alert("성공", "비밀번호 재설정 링크가 이메일로 전송되었습니다");
    } catch (error: any) {
      Alert.alert("오류", error.message);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      "회원탈퇴",
      "정말 탈퇴하시겠습니까? 모든 데이터가 영구적으로 삭제됩니다.",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              router.replace("/");
            } catch (error: any) {
              Alert.alert("오류", "회원탈퇴 실패: " + error.message);
            }
          }
        }
      ]
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(); 
      router.replace("/"); 
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfo}>
        <View
          style={{
            width: 64,
            height: 64,
            backgroundColor: "#000",
            borderRadius: 100,
          }}
        ></View>
        <Text>{user ? user.displayName : "사용자 없음"}</Text>
      </View>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.mailText}>현재 연동된{"\n"}이메일</Text>
      </SafeAreaView>

      <View style={styles.emailContainer}>
        <View style={styles.emailBox}>
          <Text style={styles.emailText}>
            {user ? user.email : "이메일 없음"}
          </Text>
        </View>
      </View>

      <Pressable style={styles.changeEmailContainer} onPress={handleEmailChange}>
        <Text style={styles.changeEmailText}>이메일 변경</Text>
        <Ionicons name="chevron-forward-outline" size={32} color="#000000" />
      </Pressable>

      <View style={styles.hr} />

      <Pressable style={styles.changeEmailContainer} onPress={handlePasswordReset}>
        <Text style={styles.changeEmailText}>비밀번호 재설정</Text>
        <Ionicons name="chevron-forward-outline" size={32} color="#000000" />
      </Pressable>

      <View style={styles.hr} />

      <Pressable style={styles.changeEmailContainer} onPress={handleLogout}>
        <Text style={styles.changeEmailText}>로그아웃</Text>
        <Ionicons name="chevron-forward-outline" size={32} color="#000000" />
      </Pressable>

      <Pressable style={styles.changeEmailContainer} onPress={handleDeleteAccount}>
        <Text style={[styles.changeEmailText, {color: '#FF0000'}]}>회원탈퇴</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  safeArea: {
    marginTop: 32,
    marginLeft: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: "SpoqaHanSans-Bold", 
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#000000",
    borderRadius: 8,
  },
  logoutButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "SpoqaHanSans-Bold",
  },
  mailText: {
    fontSize: 36,
    fontFamily: "SpoqaHanSans-Light",
  },
  userInfo: {
    marginTop: 120,
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  emailContainer: {
    width: "100%",
    height: 60,
    marginVertical: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  emailBox: {
    width: "80%",
    height: 60,
    borderWidth: 2,
    borderRadius: 100,
    borderColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  emailText: {
    fontSize: 24,
    fontFamily: "SpoqaHanSans-Thin",
  },
  changeEmailContainer: {
    marginTop: 32,
    marginLeft: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  changeEmailText: {
    fontSize: 24,
    fontFamily: "SpoqaHanSans-Bold",
  },
  hr: {
    width: "100%",
    height: 2,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
});