import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import { useRouter } from 'expo-router';

export default function ServeyMain() {
  const { user } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(auth)/serveyReadyTime'); 
    }, 3000);

   
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      
      <View style={styles.welcomeContainer}>
        <View style={[styles.welcomeBadge, { width: 150 }]}>
          <Text style={styles.welcomeNickname}>{user?.displayName}님</Text>
        </View>
        <View style={styles.welcomeBadge}>
          <Text style={styles.welcomeText}>환영합니다.</Text>
        </View>
      </View>

      {/* 질문 안내 메시지 */}
      <Text style={styles.questionText}>
        사용자 맞춤화를 위해{"\n"}<Text style={{ fontWeight: 'bold' }}>2가지</Text>만{'\n'}질문할게요
      </Text>

      {/* 아이콘 또는 그래픽 영역 */}
      <View style={styles.iconContainer}>
        {/* 그래픽 또는 아이콘을 여기에 추가할 수 있습니다 */}
      </View>
      <Image 
        source={require('@/assets/images/servey1.png')} // 이미지 경로 지정
        style={styles.img}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  welcomeContainer: {
    paddingHorizontal: 20,
    marginTop: 200,
  },
  welcomeBadge: {
    backgroundColor: '#000000',
    borderRadius: 100,
    width: 175,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  welcomeNickname: {
    color: '#ffffff',
    fontSize: 24,
    fontFamily: 'SpoqaHanSans-Bold'
  },
  welcomeText: {
    color: '#ffffff',
    fontSize: 24,
    fontFamily: 'SpoqaHanSans-Bold'
  },
  questionText: {
    fontSize: 42,
    color: '#333333',
    paddingHorizontal: 20,
    marginVertical: 40,
    fontFamily: 'SpoqaHanSans-Bold'
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  img: {
    position: 'absolute',
    right: -120,
    bottom: 0,
    width: 640, 
    height: 640,
    resizeMode: 'contain',
  }
});
