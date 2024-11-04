import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import ProgressBar from "@/components/ProgressBar";
import { useRouter } from "expo-router";
import { TimerPicker } from "react-native-timer-picker";
import { LinearGradient } from "expo-linear-gradient";
import firestore from "@react-native-firebase/firestore";
import { useFirebaseAuth } from "@/contexts/FirebaseAuthContext";

export default function ServeyReadyTime() {
  const router = useRouter();
  const { user } = useFirebaseAuth();
  const [current, setCurrent] = useState(0); 
  const [selectedDuration, setSelectedDuration] = useState({ hours: 0, minutes: 0 });

  useEffect(() => {
    
    if (selectedDuration.hours === 0 && selectedDuration.minutes === 0) {
      setCurrent(0);
    } else {
      setCurrent(1);
    }
  }, [selectedDuration]);

  const handleSaveToFirestore = async () => {
    if (current === 1) {
      try {
        
        await firestore()
          .collection("users")
          .doc(user.uid)
          .update({
            preparationTime: {
              hours: selectedDuration.hours,
              minutes: selectedDuration.minutes,
            },
          });

        console.log(
          `Firestore에 저장됨: ${selectedDuration.hours}시간, ${selectedDuration.minutes}분`
        );
        router.push("/(auth)/serveyReadyStyle"); 
      } catch (error) {
        console.error("Firestore 저장 오류:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <ProgressBar current={current} total={2} />

      <View style={styles.textBox}>
        <Text style={styles.title}>
          기상 후 외출까지{"\n"}
          걸리는 <Text style={{ fontWeight: "bold" }}>준비 시간</Text>이{"\n"}
          궁금해요
        </Text>
        <Text style={styles.subtitle}>
          떠오르는 대로 바로 답변해주세요.{"\n"}
          자세하지 않아도 괜찮아요.
        </Text>
      </View>

      <TimerPicker
        hideSeconds
        hourLabel={"시간"}
        minuteLabel={"분"}
        LinearGradient={LinearGradient}
        onDurationChange={(pickedDuration) => {
          
          setSelectedDuration({
            hours: pickedDuration.hours,
            minutes: pickedDuration.minutes,
          });
          console.log(
            `선택된 시간: ${pickedDuration.hours}시간, ${pickedDuration.minutes}분`
          );
        }}
        styles={{
          pickerContainer: {
            width: "100%",
            padding: 10,
            justifyContent: "center",
            alignItems: "center",
            top: 200,
            backgroundColor: "#ffffff",
          },
          pickerLabelContainer: {
            right: -10,
          },
        }}
      />

      <Pressable
        style={[
          styles.button,
          current === 0 && styles.disabledButton, 
        ]}
        onPress={handleSaveToFirestore}
        disabled={current === 0} 
      >
        <Text
          style={[
            styles.buttonText,
            current === 0 && styles.disabledButtonText,
          ]}
        >
          다음
        </Text>
      </Pressable>
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
  button: {
    width: "100%",
    height: 80,
    position: "absolute",
    bottom: 0,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    fontFamily: 'SpoqaHanSans-Bold'
  },
  disabledButton: {
    backgroundColor: "#c0c0c0", 
  },
  disabledButtonText: {
    color: "#ffffff", 
  },
});

