import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";
import TimePickerComponent from "../components/TimePickerComponent";

export default function LoggingScreen({ navigation, route }) {
  //const { startDateTime, logId } = route.params; switch back when api call is done
  const { startDateTime, logId } = route.params || {};
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [selectedMedications, setSelectedMedications] = useState([]);

  const symptomsOptions = [
    { id: "s1", label: "Nausea" },
    { id: "s2", label: "Aura" },
    { id: "s3", label: "Light Sensitivity" },
  ];

  const triggersOptions = [
    { id: "t1", label: "Stress" },
    { id: "t2", label: "Lack of Sleep" },
    { id: "t3", label: "Weather Change" },
  ];

  const medicationsOptions = [
    { id: "m1", label: "Ibuprofen" },
    { id: "m2", label: "Sumatriptan" },
    { id: "m3", label: "Naproxen" },
  ];

  const handleSave = async () => {
    try {
      // TODO: replace with real PUT endpoint
      const res = await fetch(`/migraine-logs/${logId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start_time: startDateTime,
          end_time: endDateTime,
          symptoms: selectedSymptoms,
          triggers: selectedTriggers,
          medications: selectedMedications,
        }),
      });

      if (!res.ok) throw new Error();
      navigation.navigate("Home");
    } catch (e) {
      Alert.alert("Error", "Could not save log. Please try again.");
    }
  };

  return (
    <View style={[styles.container, tw`flex-1`]}>
      <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>Log</Text>

      <View style={[styles.card, tw`mx-5 mt-5 p-5`]}>
        <TimePickerComponent title="End Time" onDateTimeChange={setEndDateTime}/>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39345B",
  },
  card: {
    backgroundColor: "#4D4471",
    borderRadius: 12,
  },
  nextButton: {
    backgroundColor: "#8191FF",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  selectorButton: {
    backgroundColor: "#4D4471",
    borderRadius: 8,
    padding: 12,
  },
});
