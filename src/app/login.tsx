import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../firebase";
import { saveUserSession } from "../session";

export default function LoginScreen() {
  const [phone, setPhone] = useState("");
  const [familyId, setFamilyId] = useState("");

  const loginUser = async () => {
    const userRef = doc(db, "families", familyId, "users", phone);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      Alert.alert("Login Failed", "User not found.");
      return;
    }

    const user = userSnap.data();
    await saveUserSession(user);

    if (user.role === "patient") {
      router.push("/patient" as any);
    } else {
      router.push("/caregiver" as any);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput style={styles.input} placeholder="Family ID" value={familyId} onChangeText={setFamilyId} />
      <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />

      <Pressable style={styles.button} onPress={loginUser}>
        <Text style={styles.buttonText}>Login</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EAF6F6", padding: 20, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "#17494D", textAlign: "center", marginBottom: 30 },
  input: { backgroundColor: "white", padding: 16, borderRadius: 12, fontSize: 18, marginBottom: 15 },
  button: { backgroundColor: "#1F7A8C", padding: 18, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});