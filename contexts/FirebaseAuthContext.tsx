import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { useRouter } from "expo-router";


interface FirebaseAuthContextType {
  user: any;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  updateDisplayName: (displayName: string) => Promise<void>;
  updateUserEmail: (newEmail: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  isFirstLogin: boolean;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

interface FirebaseAuthProviderProps {
  children: ReactNode;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(
  undefined
);

export const FirebaseAuthProvider: React.FC<FirebaseAuthProviderProps> = ({
  children,
}) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null); 
  const [isLoading, setIsLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 
  const [isFirstLogin, setIsFirstLogin] = useState<boolean>(false); 

  
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (firebaseUser) => {
      setIsLoading(true); 
      try {
        if (firebaseUser) {
          const userDoc = await firestore()
            .collection("users")
            .doc(firebaseUser.uid)
            .get();
          const userData = userDoc.exists ? userDoc.data() : null;

          if (userData) {
            setIsFirstLogin(userData.isFirstLogin || false);

            setUser({
              displayName: userData.displayName ?? firebaseUser.displayName,
              email: firebaseUser.email,
              uid: firebaseUser.uid,
              surveyCompleted: userData.surveyCompleted ?? false,
            });

            
            if (!userData.displayName) {
              router.replace("/(auth)/setDisplayName");
            } else if (!userData.surveyCompleted) {
              router.replace("/(auth)/serveyMain");
            } else {
              router.replace("/(tabs)/home");
            }
          }
        } else {
          
          setUser(null);
        }
      } catch (e) {
        console.error("onAuthStateChanged 에러:", e);
        setUser(null);
      } finally {
        setIsLoading(false); 
      }
    });

    return subscriber; 
  }, []);

  
  const handleError = (e: any) => {
    const errorCode = e.code || "UNKNOWN";
    const errorMessage = e.message || "알 수 없는 오류가 발생했습니다.";
    console.error(`Firebase 에러 [${errorCode}]: ${errorMessage}`);
    setError(errorMessage);
  };

  
  const clearError = () => setError(null);

  
  const signIn = async (email: string, password: string) => {
    clearError();
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const userDoc = await firestore()
        .collection("users")
        .doc(firebaseUser.uid)
        .get();
      const userData = userDoc.data();

      setUser({
        displayName: userData?.displayName ?? firebaseUser.displayName,
        email: firebaseUser.email,
        uid: firebaseUser.uid,
        surveyCompleted: userData?.surveyCompleted ?? false,
      });

      
      if (!userData?.displayName) {
        router.push("/(auth)/setDisplayName");
      } else if (!userData?.surveyCompleted) {
        router.push("/(auth)/serveyMain");
      } else {
        router.push("/(tabs)/home");
      }
    } catch (e: any) {
      handleError(e);
    }
  };

  
  const signUp = async (email: string, password: string) => {
    clearError();
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const firebaseUser = userCredential.user;

      await firestore().collection("users").doc(firebaseUser.uid).set({
        email: firebaseUser.email,
        displayName: null, 
        uid: firebaseUser.uid,
        createdAt: firestore.FieldValue.serverTimestamp(),
        surveyCompleted: false, 
      });

      setUser({
        displayName: null,
        email: firebaseUser.email,
        uid: firebaseUser.uid,
        surveyCompleted: false,
      });
    } catch (e: any) {
      handleError(e);
    }
  };

  
  const signOut = async () => {
    try {
      await auth().signOut();
      setUser(null);
    } catch (e: any) {
      handleError(e);
    }
  };

  
  const updateDisplayName = async (displayName: string) => {
    try {
      const currentUser = auth().currentUser;

      if (!currentUser || !user) {
        throw new Error("현재 로그인된 사용자가 없습니다.");
      }

      await currentUser.updateProfile({ displayName });
      await firestore().collection("users").doc(currentUser.uid).update({
        displayName,
        isFirstLogin: false,
      });

      setUser((prevUser: any) => ({
        ...prevUser,
        displayName,
      }));
    } catch (e: any) {
      handleError(e);
    }
  };

  
  const updateUserEmail = async (newEmail: string) => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error("현재 로그인된 사용자가 없습니다.");
      }

      await currentUser.updateEmail(newEmail);
      await firestore().collection("users").doc(currentUser.uid).update({
        email: newEmail,
      });

      setUser((prevUser: any) => ({
        ...prevUser,
        email: newEmail,
      }));
    } catch (e: any) {
      handleError(e);
      throw e;
    }
  };

  
  const sendPasswordReset = async (email: string) => {
    try {
      await auth().sendPasswordResetEmail(email);
    } catch (e: any) {
      handleError(e);
      throw e;
    }
  };

  
  const deleteAccount = async () => {
    try {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        throw new Error("현재 로그인된 사용자가 없습니다.");
      }

      
      const eventsSnapshot = await firestore()
        .collection("events")
        .where("userId", "==", currentUser.uid)
        .get();

      const batch = firestore().batch();
      eventsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      
      batch.delete(firestore().collection("users").doc(currentUser.uid));
      await batch.commit();

      
      await currentUser.delete();
      setUser(null);
    } catch (e: any) {
      handleError(e);
      throw e;
    }
  };

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signIn,
        signUp,
        signOut,
        clearError,
        updateDisplayName,
        updateUserEmail,
        sendPasswordReset,
        deleteAccount,
        isFirstLogin,
        setUser,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = (): FirebaseAuthContextType => {
  const context = useContext(FirebaseAuthContext);
  if (!context) {
    throw new Error(
      "useFirebaseAuth는 FirebaseAuthProvider 내에서만 사용할 수 있습니다."
    );
  }
  return context;
};
