import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";
import TimePickerComponent from "../components/TimePickerComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:8000";

// For Android emulator, use this instead:
// const BASE_URL = "http://10.0.2.2:8000";

export default function QuickLogScreen({ navigation }) {
  const [startDateTime, setStartDateTime] = useState(new Date());

  const pad = (n) => n.toString().padStart(2, "0");

  const handleNext = async () => {
    try {
      // Format the date and time to match the expected format, not UTC time
      const localTimeString =
        `${startDateTime.getFullYear()}-${pad(startDateTime.getMonth() + 1)}-${pad(startDateTime.getDate())}` +
        `T${pad(startDateTime.getHours())}:${pad(startDateTime.getMinutes())}:00`;

      const token = await AsyncStorage.getItem("access_token");

      const res = await fetch(`${BASE_URL}/migraines/quick-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_time: localTimeString,
        }), 
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Could not start log");
      }

      navigation.navigate("Logging", {
        logId: data.id,
      });
    } catch (e) {
      console.error("QuickLog error", e);
    }
  };

  const handleSaveForLater = async () => {
    try {
      // Format the date and time to match the expected format, not UTC time
      const localTimeString =
        `${startDateTime.getFullYear()}-${pad(startDateTime.getMonth() + 1)}-${pad(startDateTime.getDate())}` +
        `T${pad(startDateTime.getHours())}:${pad(startDateTime.getMinutes())}:00`;

      const token = await AsyncStorage.getItem("access_token");

      const res = await fetch(`${BASE_URL}/migraines/quick-log`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_time: localTimeString,
        }), 
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Could not start log");
      }

      navigation.navigate("Main", { screen: "Home" });
    } catch (e) {
      console.error("QuickLog error", e);
    }
  };

  return (
    <View style={[styles.container, tw`flex-1`]}>
      <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>
        Quick Log
      </Text>
      <View style={[styles.card, tw`mx-5 mt-5 p-5`]}>
        <TimePickerComponent
          title="Start Time"
          initialDateTime={startDateTime}
          onDateTimeChange={setStartDateTime}
        />
      </View>

      <View style={tw`flex-row justify-between items-center mt-6 mx-5`}>
        <TouchableOpacity onPress={handleSaveForLater}>
          <Text style={tw`text-white text-base`}>Save For Later</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={tw`text-white text-center font-bold text-lg`}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: "#39345B"
  },
  card: { 
    backgroundColor: "#4D4471",
    borderRadius: 12 
  },
  nextButton: {
    backgroundColor: "#8191FF",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
