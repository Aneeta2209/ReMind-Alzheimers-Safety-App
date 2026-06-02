import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function VoiceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Voice Instruction</Text>

      <Text style={styles.label}>Type caregiver message:</Text>

      <TextInput
        style={styles.input}
        placeholder="Amma, don't worry. Walk slowly. I am here for you."
        multiline
      />

      <Pressable
        style={styles.button}
        onPress={() => Alert.alert("Saved", "Voice instruction message saved.")}
      >
        <Text style={styles.buttonText}>Save Message</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF6F6",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#17494D",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    minHeight: 120,
    marginBottom: 25,
    textAlignVertical: "top",
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
