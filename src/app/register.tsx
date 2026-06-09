import { router } from "expo-router";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../firebase";
import { saveUserSession } from "../session";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [role, setRole] = useState<"patient" | "caregiver">("patient");
  const [safeRadius, setSafeRadius] = useState("500");

  const registerUser = async () => {
    if (!name || !phone || !familyId) {
      Alert.alert("Missing Details", "Please fill all fields.");
      return;
    }

    const user = {
      name,
      phone,
      familyId,
      role,
      safeRadius,
      createdAt: new Date().toLocaleString(),
    };

    await setDoc(doc(db, "families", familyId, "users", phone), user);

    if (role === "patient") {
      await setDoc(doc(db, "families", familyId, "profile", "patient"), {
        patientName: name,
        patientPhone: phone,
        safeRadius,
      });
    } else {
      await setDoc(doc(db, "families", familyId, "profile", "caregiver"), {
        caregiverName: name,
        caregiverPhone: phone,
      });
    }

    await saveUserSession(user);

    if (role === "patient") {
      router.push("/patient" as any);
    } else {
      router.push("/caregiver" as any);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="Family ID" value={familyId} onChangeText={setFamilyId} />

      <View style={styles.roleRow}>
        <Pressable style={[styles.roleButton, role === "patient" && styles.selected]} onPress={() => setRole("patient")}>
          <Text style={styles.roleText}>Patient</Text>
        </Pressable>

        <Pressable style={[styles.roleButton, role === "caregiver" && styles.selected]} onPress={() => setRole("caregiver")}>
          <Text style={styles.roleText}>Caregiver</Text>
        </Pressable>
      </View>

      {role === "patient" && (
        <TextInput style={styles.input} placeholder="Safe Radius in meters" value={safeRadius} onChangeText={setSafeRadius} keyboardType="numeric" />
      )}

      <Pressable style={styles.button} onPress={registerUser}>
        <Text style={styles.buttonText}>Create Account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EAF6F6", padding: 20, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "#17494D", textAlign: "center", marginBottom: 30 },
  input: { backgroundColor: "white", padding: 16, borderRadius: 12, fontSize: 18, marginBottom: 15 },
  roleRow: { flexDirection: "row", gap: 10, marginBottom: 15 },
  roleButton: { flex: 1, padding: 16, backgroundColor: "#9DBEBB", borderRadius: 12, alignItems: "center" },
  selected: { backgroundColor: "#1F7A8C" },
  roleText: { color: "white", fontWeight: "bold", fontSize: 16 },
  button: { backgroundColor: "#1F7A8C", padding: 18, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});