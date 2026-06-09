import { useEffect, useState } from "react";
import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getUserSession } from "../session";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
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
  const [patientName, setPatientName] = useState("Patient");
  const [location, setLocation] = useState("Loading location...");
  const [distance, setDistance] = useState(0);
  const [safeStatus, setSafeStatus] = useState("Checking...");
  const [safeRadius, setSafeRadius] = useState(500);

  const HOME_LAT = 8.8893746;
  const HOME_LNG = 76.5957889;

  useEffect(() => {
    async function checkLocation() {
      const user = await getUserSession();

      if (!user) {
        Alert.alert("Not Logged In", "Please login first.");
        return;
      }

      const familyId = user.familyId;

      const profileSnap = await getDoc(
        doc(db, "families", familyId, "profile", "patient")
      );

      let currentPatientName = user.name || "Patient";
      let currentSafeRadius = 500;

      if (profileSnap.exists()) {
        const profileData = profileSnap.data();
        currentPatientName = profileData.patientName || user.name || "Patient";
        currentSafeRadius = Number(profileData.safeRadius) || 500;
      }

      setPatientName(currentPatientName);
      setSafeRadius(currentSafeRadius);

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

      await setDoc(doc(db, "families", familyId, "patientLocation", "latest"), {
        patientName: currentPatientName,
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        distance: calculatedDistance.toFixed(0) + " m",
        status:
          calculatedDistance <= currentSafeRadius
            ? "SAFE"
            : "OUTSIDE SAFE ZONE",
        safeRadius: currentSafeRadius + " m",
        time: new Date().toLocaleString(),
      });

      if (calculatedDistance <= currentSafeRadius) {
        setSafeStatus("You are SAFE");
      } else {
        setSafeStatus("Outside Safe Zone");

        await setDoc(doc(db, "families", familyId, "alerts", "latest"), {
          type: "SAFE_ZONE",
          message: "Patient moved outside safe zone",
          patientName: currentPatientName,
          status: "active",
          distance: calculatedDistance.toFixed(0) + " m",
          time: new Date().toLocaleString(),
        });

        Speech.speak(
          `${currentPatientName}, you are outside the safe zone. Your caregiver has been notified. Please stay calm.`
        );

        Linking.openURL(
          `https://www.google.com/maps/dir/?api=1&destination=${HOME_LAT},${HOME_LNG}`
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

        <Text style={styles.normalText}>Patient: {patientName}</Text>
        <Text style={styles.normalText}>Safe Radius: {safeRadius} m</Text>

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
            `${patientName}, don't worry. I am here for you. Walk slowly.`
          )
        }
      >
        <Text style={styles.buttonText}>Play Caregiver Voice</Text>
      </Pressable>

      <Pressable
        style={styles.button}
        onPress={() =>
          Linking.openURL(
            `https://www.google.com/maps/dir/?api=1&destination=${HOME_LAT},${HOME_LNG}`
          )
        }
      >
        <Text style={styles.buttonText}>Navigate Home</Text>
      </Pressable>

      <Pressable
        style={styles.sosButton}
        onPress={async () => {
          const user = await getUserSession();

          if (!user) {
            Alert.alert("Not Logged In", "Please login first.");
            return;
          }

          await setDoc(doc(db, "families", user.familyId, "alerts", "latest"), {
            type: "SOS",
            message: "Patient needs emergency help!",
            patientName: patientName,
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