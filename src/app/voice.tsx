import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { router } from "expo-router";

export default function VoiceScreen() {
  const [message, setMessage] = useState(
    "Don't worry. Walk slowly. I am here for you."
  );

  const saveMessage = async () => {
    await setDoc(doc(db, "voiceMessages", "main"), {
      message,
      updatedAt: new Date().toLocaleString(),
    });

    Alert.alert("Saved", "Caregiver voice message saved.");
    router.push("/caregiver");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Instruction</Text>

      <TextInput
        style={styles.input}
        multiline
        value={message}
        onChangeText={setMessage}
        placeholder="Type calming instruction for patient"
      />

      <Pressable style={styles.button} onPress={saveMessage}>
        <Text style={styles.buttonText}>Save Message</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EAF6F6", padding: 20, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "#17494D", textAlign: "center", marginBottom: 30 },
  input: { backgroundColor: "white", padding: 16, borderRadius: 12, fontSize: 18, minHeight: 130, textAlignVertical: "top", marginBottom: 20 },
  button: { backgroundColor: "#1F7A8C", padding: 18, borderRadius: 12, alignItems: "center" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});