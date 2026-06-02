import * as Location from "expo-location";
import * as Speech from "expo-speech";
import { doc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { db } from "../firebase";

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default function PatientScreen() {
  const [location, setLocation] = useState("Loading location...");
  const [distance, setDistance] = useState(0);
  const [safeStatus, setSafeStatus] = useState("Checking...");

  const HOME_LAT = 8.8893746;
  const HOME_LNG = 76.5957889;

  useEffect(() => {
    async function checkLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setLocation("Permission denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});

      setLocation(
        `${currentLocation.coords.latitude},\n${currentLocation.coords.longitude}`
      );

      const calculatedDistance = calculateDistance(
        HOME_LAT,
        HOME_LNG,
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

      setDistance(calculatedDistance);
await setDoc(doc(db, "patientLocation", "latest"), {
  patientName: "Margaret John",
  latitude: currentLocation.coords.latitude,
  longitude: currentLocation.coords.longitude,
  distance: calculatedDistance.toFixed(0) + " m",
  status: calculatedDistance <= 500 ? "SAFE" : "OUTSIDE SAFE ZONE",
  time: new Date().toLocaleString(),
});
      if (calculatedDistance <= 100) {
        setSafeStatus("You are SAFE");
      } else {
        setSafeStatus("Outside Safe Zone");

        await setDoc(doc(db, "alerts", "latest"), {
          type: "SAFE_ZONE",
          message: "Patient moved outside safe zone",
          patientName: "Margaret John",
          status: "active",
          distance: calculatedDistance.toFixed(0) + " m",
          time: new Date().toLocaleString(),
        });

        Speech.speak(
          "Amma, you are away from home. Please return home slowly."
        );
Linking.openURL(
  "https://www.google.com/maps/dir/?api=1&destination=8.8893746,76.5957889"
);
        Alert.alert(
          "Safe Zone Alert",
          "Caregiver has been notified automatically."
        );
      }
    }

    checkLocation();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Patient Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Safe Zone Status</Text>
        <Text style={styles.safeText}>{safeStatus}</Text>

        <Text style={styles.normalText}>Location:</Text>
        <Text style={styles.normalText}>{location}</Text>

        <Text style={styles.normalText}>
          Distance from home: {distance.toFixed(0)} m
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
        <Text style={styles.buttonText}>Play Caregiver Voice</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() =>
  Linking.openURL(
    "https://www.google.com/maps/dir/?api=1&destination=8.8893746,76.5957889"
  )
}
         
      >
        <Text style={styles.buttonText}>Navigate Home</Text>
      </Pressable>

      <Pressable
        style={styles.sosButton}
        onPress={async () => {
          await setDoc(doc(db, "alerts", "latest"), {
            type: "SOS",
            message: "Patient needs emergency help!",
            patientName: "Margaret John",
            status: "active",
            time: new Date().toLocaleString(),
          });

          Alert.alert("Emergency Alert", "Caregiver has been notified.");
        }}
      >
        <Text style={styles.buttonText}>SOS Emergency</Text>
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
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
  },
  safeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "green",
    marginBottom: 15,
  },
  normalText: {
    fontSize: 18,
    marginBottom: 5,
    color: "#333",
  },
  button: {
    width: "100%",
    backgroundColor: "#3F8291",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  sosButton: {
    width: "100%",
    backgroundColor: "#CC3333",
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
