import { useEffect, useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

export default function CaregiverScreen() {
  const [patientName, setPatientName] = useState("Patient");
  const [caregiverName, setCaregiverName] = useState("Caregiver");
  const [distance, setDistance] = useState("--");
  const [status, setStatus] = useState("--");
  const [time, setTime] = useState("--");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const profileSnap = await getDoc(doc(db, "profiles", "main"));

      if (profileSnap.exists()) {
        const data = profileSnap.data();
        setPatientName(data.patientName || "Patient");
        setCaregiverName(data.caregiverName || "Caregiver");
      }
    };

    loadProfile();

    const locationRef = doc(db, "patientLocation", "latest");
    const unsubscribeLocation = onSnapshot(locationRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setPatientName(data.patientName || "Patient");
        setDistance(data.distance || "--");
        setStatus(data.status || "--");
        setTime(data.time || "--");
        setLatitude(data.latitude);
        setLongitude(data.longitude);
      }
    });

    const alertRef = doc(db, "alerts", "latest");
    const unsubscribeAlert = onSnapshot(alertRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        if (data.status === "active") {
          Alert.alert(
            "Emergency Alert",
            `${data.patientName}: ${data.message}\nStatus: ${data.status}\nTime: ${data.time}`
          );
        }
      }
    });

    return () => {
      unsubscribeLocation();
      unsubscribeAlert();
    };
  }, []);

  const openPatientLocation = () => {
    if (latitude && longitude) {
      Linking.openURL(`https://www.google.com/maps?q=${latitude},${longitude}`);
    } else {
      Alert.alert("Location Not Found", "Patient location is not available yet.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Caregiver Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Patient Details</Text>
        <Text style={styles.normalText}>Caregiver: {caregiverName}</Text>
        <Text style={styles.normalText}>Patient: {patientName}</Text>
        <Text style={styles.normalText}>Status: {status}</Text>
        <Text style={styles.normalText}>Distance: {distance}</Text>
        <Text style={styles.normalText}>Updated: {time}</Text>
      </View>

      <Pressable style={styles.button} onPress={() => router.push("/voice")}>
        <Text style={styles.buttonText}>Set Voice Instruction</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={openPatientLocation}>
        <Text style={styles.buttonText}>Track Patient Location</Text>
      </Pressable>

      <Pressable
        style={styles.alertButton}
        onPress={async () => {
          const alertSnap = await getDoc(doc(db, "alerts", "latest"));

          if (alertSnap.exists()) {
            const data = alertSnap.data();

            Alert.alert(
              "Latest Alert",
              `${data.patientName}: ${data.message}\nStatus: ${data.status}\nTime: ${data.time}`
            );
          } else {
            Alert.alert("No Alerts", "No emergency alerts found.");
          }
        }}
      >
        <Text style={styles.buttonText}>View Emergency Alerts</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EAF6F6", padding: 20, justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "#17494D", textAlign: "center", marginBottom: 30 },
  card: { backgroundColor: "white", padding: 22, borderRadius: 15, marginBottom: 25 },
  cardTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 10, color: "#17494D" },
  normalText: { fontSize: 18, color: "#333", marginBottom: 8 },
  button: { backgroundColor: "#1F7A8C", padding: 18, borderRadius: 12, marginBottom: 15, alignItems: "center" },
  alertButton: { backgroundColor: "#F77F00", padding: 18, borderRadius: 12, marginTop: 10, alignItems: "center" },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});