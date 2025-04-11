import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "react-native-wheel-pick";
import tw from "tailwind-react-native-classnames";

export default function QuickLogScreen({ navigation }) {
  const hours = [];
  for (let i = 1; i <= 12; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`; // Format hour to 2 digits, string interpolation
    hours.push(hour);
  }

  const minutes = [];
  for (let i = 0; i < 60; i++) {
    const minute = i < 10 ? `0${i}` : `${i}`;
    minutes.push(minute);
  }

  const periods = ["AM", "PM"];

  const [selectedHour, setSelectedHour] = useState(hours[0]);
  const [selectedMinute, setSelectedMinute] = useState(minutes[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);

  // Helper to build Date object from current picks
  const getSelectedDateTime = () => {
    const hour12 = parseInt(selectedHour, 10);
    const minute = parseInt(selectedMinute, 10);
    let hour24 = hour12;

    if (selectedPeriod === "PM" && hour12 < 12) {
      hour24 = hour12 + 12;
    }
    if (selectedPeriod === "AM" && hour12 === 12) {
      hour24 = 0;
    }

    const now = new Date(); // turn into a date object
    const startDateTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour24,
      minute,
      0
    );

    return startDateTime;
  };

  const handleNext = () => {
    // add post here when ready
    const startDateTime = getSelectedDateTime();
    navigation.navigate("Logging", { startDateTime });
  };

  const handleSaveForLater = () => {
    // add post here when ready
    navigation.navigate("Home");
  };

  return (
    <View style={[styles.container, tw`flex-1`]}>
      <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>Quick Log</Text>

      <View style={[styles.card, tw`mx-5 mt-5 p-5`]}>
        <Text style={tw`text-white text-lg font-bold`}>Start Time</Text>

        <View style={tw`flex-row justify-around items-center`}>
          {/* Hour Picker */}
          <Picker
            style={styles.pickerStyle}
            pickerData={hours}
            selectedValue={selectedHour}
            onValueChange={setSelectedHour}
            textColor="#FFFFFF"
            itemTextSize={20}
          />

          <Text style={tw`text-white text-xl mx-1`}>:</Text>

          {/* Minute Picker */}
          <Picker
            style={styles.pickerStyle}
            pickerData={minutes}
            selectedValue={selectedMinute}
            onValueChange={setSelectedMinute}
            textColor="#FFFFFF"
            itemTextSize={20}
          />

          {/* AM/PM Picker */}
          <Picker
            style={styles.pickerStyle}
            pickerData={periods}
            selectedValue={selectedPeriod}
            onValueChange={setSelectedPeriod}
            textColor="#FFFFFF"
            itemTextSize={20}
          />
        </View>
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
    backgroundColor: "#39345B",
  },
  card: {
    backgroundColor: "#4D4471",
    borderRadius: 12,
  },
  pickerStyle: {
    height: 215,
    width: 100,
    backgroundColor: "#4D4471",
  },
  nextButton: {
    backgroundColor: "#6A7DFF",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
