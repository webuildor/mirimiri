import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import ProgressBar from '@/components/ProgressBar';
import { useRouter } from 'expo-router';
import { useFirebaseAuth } from '@/contexts/FirebaseAuthContext';
import firestore from '@react-native-firebase/firestore';

export default function serveyComplete() {
  const router = useRouter();
  const { user, setUser } = useFirebaseAuth();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (user) {
        await firestore()
          .collection('users')
          .doc(user.uid)
          .update({
            isFirstLogin: true,
            surveyCompleted: true,
          });

        setUser((prevUser: any) => ({
          ...prevUser,
          isFirstLogin: true,
          surveyCompleted: true,
        }));
      }

      router.replace('/(tabs)/home');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, user, setUser]);

  return (
    <View style={styles.container}>
      <ProgressBar current={3} total={3} />

      <View style={styles.completeBox}>
        <Text style={styles.completeText}>
          <Text style={{ fontWeight: 'bold' }}>미리미리</Text>를{'\n'}
          사용할 준비가{'\n'}
          끝났어요!
        </Text>
      </View>
      <Image
        source={require('@/assets/images/servey2.png')}
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
  completeBox: {
    paddingHorizontal: 20,
    width: '100%',
    height: 300,
    justifyContent: 'center',
  },
  completeText: {
    fontSize: 42,
    fontFamily: 'SpoqaHanSans-Bold'
  },
  img: {
    position: 'absolute',
    right: -120,
    bottom: 50,
    width: 480,
    height: 480,
    resizeMode: 'contain',
  },
});
