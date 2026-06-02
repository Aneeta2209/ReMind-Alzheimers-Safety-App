
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ReMind</Text>

      <Text style={styles.subtitle}>
        Personalized Voice-Guided Safety Navigation for Alzheimer's Patients
      </Text>

   <Pressable
  style={styles.button}
  onPress={() => router.push("/patient")}
>
  <Text style={styles.buttonText}>Patient Mode</Text>
</Pressable>

      <Pressable
  style={styles.button}
  onPress={() => router.push("/caregiver")}
>
  <Text style={styles.buttonText}>Caregiver Mode</Text>
</Pressable>

      <Pressable style={styles.helpButton}>
        <Text style={styles.buttonText}>Emergency Help</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF6F6",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#17494D",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    color: "#333",
    marginBottom: 40,
  },
  button: {
    width: "100%",
    backgroundColor: "#1F7A8C",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  helpButton: {
    width: "100%",
    backgroundColor: "#D62828",
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

