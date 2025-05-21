import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "react-native-wheel-pick";
import tw from "tailwind-react-native-classnames";

const TimePickerComponent = ({ title, onDateTimeChange, initialDateTime }) => {
  const hours = [];
  for (let i = 1; i <= 12; i++) {
    const hour = i < 10 ? `0${i}` : `${i}`;
    hours.push(hour);
  }

  const minutes = [];
  for (let i = 0; i < 60; i++) {
    const minute = i < 10 ? `0${i}` : `${i}`;
    minutes.push(minute);
  }

  const periods = ["AM", "PM"];

  // set vals from initialDateTime or fallback to 12:00 AM
  let hour24 = 0;
  let minute = 0;
  
  if (initialDateTime) {
    hour24 = initialDateTime.getHours();
    minute = initialDateTime.getMinutes();
  }  

  let hour12 = hour24 % 12;
  if (hour12 === 0) {
    hour12 = 12;
  }

  const [selectedHour, setSelectedHour] = useState(hour12.toString().padStart(2, "0"));
  const [selectedMinute, setSelectedMinute] = useState(minute.toString().padStart(2, "0"));
  const [selectedPeriod, setSelectedPeriod] = useState(hour24 >= 12 ? "PM" : "AM");

  const getSelectedDateTime = () => {
    const hour12 = parseInt(selectedHour, 10);
    const minute = parseInt(selectedMinute, 10);
    let hour24 = hour12;

    if (selectedPeriod === "PM" && hour12 < 12) {
      hour24 += 12;
    }

    if (selectedPeriod === "AM" && hour12 === 12) {
      hour24 = 0;
    }

    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour24, minute, 0);
  };

  useEffect(() => {
    if (onDateTimeChange) {
      onDateTimeChange(getSelectedDateTime());
    }
  }, [selectedHour, selectedMinute, selectedPeriod]);

  return (
    <View>
      <Text style={tw`text-white text-lg font-bold mb-2`}>{title}</Text>
      <View style={tw`flex-row justify-around items-center`}>
        <Picker
          style={styles.pickerStyle}
          pickerData={hours}
          selectedValue={selectedHour}
          onValueChange={setSelectedHour}
          textColor="#FFFFFF"
        />
        <Text style={tw`text-white text-xl mx-1`}>:</Text>
        <Picker
          style={styles.pickerStyle}
          pickerData={minutes}
          selectedValue={selectedMinute}
          onValueChange={setSelectedMinute}
          textColor="#FFFFFF"
        />
        <Picker
          style={styles.pickerStyle}
          pickerData={periods}
          selectedValue={selectedPeriod}
          onValueChange={setSelectedPeriod}
          textColor="#FFFFFF"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerStyle: {
    height: 215,
    width: 100,
    backgroundColor: "transparent",
  },
});

export default TimePickerComponent;