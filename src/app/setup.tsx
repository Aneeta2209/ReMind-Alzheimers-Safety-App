import { View, Text, StyleSheet, Pressable } from "react-native";
import { router } from "expo-router";

export default function SetupScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup moved to Register</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/register" as any)}
      >
        <Text style={styles.buttonText}>Go to Register</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF6F6",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#17494D",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#1F7A8C",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});