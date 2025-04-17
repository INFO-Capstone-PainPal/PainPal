import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";
import TimePickerComponent from "../components/TimePickerComponent";

export default function LoggingScreen({ navigation, route }) {
  const [endDateTime, setEndDateTime] = useState(new Date());

  const handleNext = () => {
    navigation.navigate("Logging", { startDateTime });
  };

  const log = route?.params?.log;

  return (
    <View style={[styles.container, tw`flex-1`]}>
      <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>Log</Text>

      {log && (
        <View style={[styles.card, tw`mx-5 mt-5 p-4`]}>
          <Text style={tw`text-white text-lg font-bold mb-2`}>
            Dummy Log (passed from Calendar)
          </Text>
          <Text style={tw`text-white text-base`}>
            ID: {log.id}
          </Text>
          <Text style={tw`text-white text-base`}>
            Title: {log.title}
          </Text>
        </View>
      )}

      <View style={[styles.card, tw`mx-5 mt-5 p-5`]}>
        <TimePickerComponent title="End Time" onDateTimeChange={setEndDateTime} />
      </View>

      <View style={tw`flex-row justify-between items-center mt-6 mx-5`}>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={tw`text-white text-center font-bold text-lg`}>Save</Text>
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
});