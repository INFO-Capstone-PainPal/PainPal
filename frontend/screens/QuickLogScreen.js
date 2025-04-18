import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";
import TimePickerComponent from "../components/TimePickerComponent";

export default function QuickLogScreen({ navigation }) {
  const [startDateTime, setStartDateTime] = useState(new Date());

  const handleNext = async () => {
    try {
      // TODO: replace with real POST endpoint
      const res = await fetch("/migraine-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start_time: startDateTime }),
      });

      const newLog = await res.json();
      navigation.navigate("Logging", {
        startDateTime,
        logId: newLog.id,
      });
    } catch (e) {
      Alert.alert("Error", "Could not start log. Please try again.");
    }
  };

  const handleSaveForLater = () => {
    navigation.navigate("Home");
  };

  return (
    <View style={[styles.container, tw`flex-1`]}>
      <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>Quick Log</Text>
      <View style={[styles.card, tw`mx-5 mt-5 p-5`]}>
        <TimePickerComponent title="Start Time" onDateTimeChange={setStartDateTime}/>
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
