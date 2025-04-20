import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";
import TimePickerComponent from "../components/TimePickerComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoggingScreen({ navigation, route }) {
  const { logId } = route.params; 
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);

  const pad = (n) => n.toString().padStart(2, "0");

  const handleSave = async () => {
    try {
      const localTimeString = 
        `${endDateTime.getFullYear()}-${pad(endDateTime.getMonth() + 1)}-${pad(endDateTime.getDate())}` +
        `T${pad(endDateTime.getHours())}:${pad(endDateTime.getMinutes())}:00`;

      const token = await AsyncStorage.getItem("access_token");

      const res = await fetch(`http://localhost:8000/migraines/${logId}/complete`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            end_time: localTimeString,
            symptom_option_ids: selectedSymptoms,
            trigger_option_ids: selectedTriggers,
            medication_option_ids: selectedMedications,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to save log");
      }
    } catch (e) {
      console.error("Logging error", e);
    }
  };

  return (
    <View style={[styles.container, tw`flex-1`]}>
      <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>Log</Text>

      <View style={[styles.card, tw`mx-5 mt-5 p-5`]}>
        <TimePickerComponent
          title="End Time"
          onDateTimeChange={setEndDateTime}
        />
      </View>

      <View style={tw`mt-6 mx-5 my-4`}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MultiSelect", {
              title: "Symptoms",
              options: symptomsOptions,
              initialSelected: selectedSymptoms,
              onSave: setSelectedSymptoms,
            })
          }
          style={styles.selectorButton}
        >
          <Text style={tw`text-white`}>
            Symptoms ({selectedSymptoms.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MultiSelect", {
              title: "Triggers",
              options: triggersOptions,
              initialSelected: selectedTriggers,
              onSave: setSelectedTriggers,
            })
          }
          style={styles.selectorButton}
        >
          <Text style={tw`text-white`}>
            Triggers ({selectedTriggers.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MultiSelect", {
              title: "Medications",
              options: medicationsOptions,
              initialSelected: selectedMedications,
              onSave: setSelectedMedications,
            })
          }
          style={styles.selectorButton}
        >
          <Text style={tw`text-white`}>
            Medications ({selectedMedications.length})
          </Text>
        </TouchableOpacity>
      </View>

      <View style={tw`flex-row justify-between items-center mt-6 mx-5`}>
        <TouchableOpacity style={styles.nextButton} onPress={handleSave}>
          <Text style={tw`text-white text-center font-bold text-lg`}>
            Save Log
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const symptomsOptions = [
  { id: 1, label: "Nausea" },
  { id: 2, label: "Aura" },
  { id: 3, label: "Light Sensitivity" },
];
const triggersOptions = [
  { id: 1, label: "Stress" },
  { id: 2, label: "Lack of Sleep" },
  { id: 3, label: "Weather Change" },
];
const medicationsOptions = [
  { id: 1, label: "Ibuprofen" },
  { id: 2, label: "Sumatriptan" },
  { id: 3, label: "Naproxen" },
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39345B",
  },
  card: {
    backgroundColor: "#4D4471",
    borderRadius: 12,
  },
  selectorButton: {
    backgroundColor: "#4D4471",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: "#8191FF",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
