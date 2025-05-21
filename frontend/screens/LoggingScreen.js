import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";
import TimePickerComponent from "../components/TimePickerComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://localhost:8000";

// For Android emulator, use this instead:
// const BASE_URL = "http://10.0.2.2:8000";

export default function LoggingScreen({ navigation, route }) {
  const { logId } = route.params; 
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);
  const [painLevel, setPainLevel] = useState(0);

  const [symptomOptions, setSymptomOptions] = useState([]);
  const [triggerOptions, setTriggerOptions] = useState([]);
  const [medicationOptions, setMedicationOptions] = useState([]);


  const pad = (n) => n.toString().padStart(2, "0");

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const res = await fetch(`${BASE_URL}/options/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        setSymptomOptions(data.symptoms.map((item) => ({ id: item.id, label: item.name })));
        setTriggerOptions(data.triggers.map((item) => ({ id: item.id, label: item.name })));
        setMedicationOptions(data.medications.map((item) => ({ id: item.id, label: item.name })));
      } catch (err) {
        console.error("Failed to fetch options", err);
      }
    };

    fetchOptions();
  }, []);

  const handleSave = async () => {
    try {
      const localTimeString = 
        `${endDateTime.getFullYear()}-${pad(endDateTime.getMonth() + 1)}-${pad(endDateTime.getDate())}` +
        `T${pad(endDateTime.getHours())}:${pad(endDateTime.getMinutes())}:00`;

      const token = await AsyncStorage.getItem("access_token");

      const res = await fetch(`${BASE_URL}/migraines/${logId}/complete`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            end_time: localTimeString,
            symptoms: selectedSymptoms,
            triggers: selectedTriggers,
            medications: selectedMedications,
            pain_level: painLevel,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to save log");
      }

      navigation.navigate("Main");
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
          initialDateTime={endDateTime}
          onDateTimeChange={setEndDateTime}
        />
      </View>

      <View style={tw`mt-6 mx-5 my-4`}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MultiSelect", {
              title: "Symptoms",
              options: symptomOptions,
              initialSelected: selectedSymptoms,
              onSave: setSelectedSymptoms,
            })
          }
          style={styles.selectorButton}
        >
          <Text style={tw`text-white text-lg font-bold`}>
            Symptoms ({selectedSymptoms.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MultiSelect", {
              title: "Triggers",
              options: triggerOptions,
              initialSelected: selectedTriggers,
              onSave: setSelectedTriggers,
            })
          }
          style={styles.selectorButton}
        >
          <Text style={tw`text-white text-lg font-bold`}>
            Triggers ({selectedTriggers.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MultiSelect", {
              title: "Medications",
              options: medicationOptions,
              initialSelected: selectedMedications,
              onSave: setSelectedMedications,
            })
          }
          style={styles.selectorButton}
        >
          <Text style={tw`text-white text-lg font-bold`}>
            Medications ({selectedMedications.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate("PainMap", {
              initialSelected: painLevel,
              onSave: setPainLevel,
            })
          }
          style={styles.selectorButton}
        >
          <Text style={tw`text-white`}>
            Pain Map
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39345B",
  },
  card: {
    backgroundColor: "#4D4471",
    borderRadius: 12,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  selectorButton: {
    backgroundColor: "#4D4471",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  nextButton: {
    backgroundColor: "#8191FF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
