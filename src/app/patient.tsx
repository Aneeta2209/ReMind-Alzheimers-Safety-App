
import * as Speech from "expo-speech";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

export default function PatientScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Safe Zone Status</Text>
        <Text style={styles.safeText}>You are SAFE</Text>
        <Text style={styles.normalText}>
          Distance from home: 120 m
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() =>
          Speech.speak(
            "Amma, don't worry. Walk slowly. I am here for you."
          )
        }
      >
        <Text style={styles.buttonText}>
          Play Caregiver Voice
        </Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() =>
          Alert.alert(
            "Navigation",
            "Navigate home feature will be added next."
          )
        }
      >
        <Text style={styles.buttonText}>
          Navigate Home
        </Text>
      </Pressable>

      <Pressable
        style={styles.sosButton}
        onPress={() =>
          Alert.alert(
            "Emergency Alert",
            "Caregiver has been notified."
          )
        }
      >
        <Text style={styles.buttonText}>
          SOS Emergency
        </Text>
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
    fontSize: 32,
    fontWeight: "bold",
    color: "#17494D",
    marginBottom: 30,
  },

  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  safeText: {
    color: "green",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },

  normalText: {
    fontSize: 16,
    color: "#444",
  },

  button: {
    width: "100%",
    backgroundColor: "#1F7A8C",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },

  sosButton: {
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
