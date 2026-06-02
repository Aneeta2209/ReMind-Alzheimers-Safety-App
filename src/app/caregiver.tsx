import { doc, getDoc } from "firebase/firestore";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { db } from "../firebase";

import { router } from "expo-router";
export default function CaregiverScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Caregiver Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Details</Text>
        <Text style={styles.normalText}>Patient Name: Margaret John</Text>
        <Text style={styles.normalText}>Safe Radius: 500 m</Text>
        <Text style={styles.normalText}>Status: Safe</Text>
      </View>

<Pressable
  style={styles.button}
  onPress={() => router.push("/voice")}
>
 <Text style={styles.buttonText}>OPEN VOICE SCREEN NOW</Text>
</Pressable>

      <Pressable
  style={styles.button}
 onPress={async () => {
  const locationRef = doc(db, "patientLocation", "latest");
  const locationSnap = await getDoc(locationRef);

  if (locationSnap.exists()) {
    const data = locationSnap.data();

    Linking.openURL(
      `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
    );
  } else {
    Alert.alert(
      "No Location",
      "Patient location is not available yet."
    );
  }
}}
>
        <Text style={styles.buttonText}>Track Patient Location</Text>
      </Pressable>

      <Pressable
        style={styles.alertButton}
        onPress={async () => {
  const alertRef = doc(db, "alerts", "latest");
  const alertSnap = await getDoc(alertRef);

  if (alertSnap.exists()) {
    const data = alertSnap.data();

    Alert.alert(
      "Emergency Alert",
      `${data.patientName}: ${data.message}\nStatus: ${data.status}\nTime: ${data.time}`
    );
  } else {
    Alert.alert("No Alerts", "Patient is currently inside the safe zone.");
  }
}}
      >
        <Text style={styles.buttonText}>View Emergency Alerts</Text>
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
  card: {
    backgroundColor: "white",
    padding: 22,
    borderRadius: 15,
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#17494D",
  },
  normalText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 8,
  },
  button: {
    backgroundColor: "#1F7A8C",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  alertButton: {
    backgroundColor: "#F77F00",
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
