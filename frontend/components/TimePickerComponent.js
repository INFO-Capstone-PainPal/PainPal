import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "react-native-wheel-pick";
import tw from "tailwind-react-native-classnames";

const TimePickerComponent = ({ title, onDateTimeChange }) => {
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

  const [selectedHour, setSelectedHour] = useState(hours[0]);
  const [selectedMinute, setSelectedMinute] = useState(minutes[0]);
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);

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
      <Text style={tw`text-white text-lg font-bold`}>{title}</Text>
      <View style={tw`flex-row justify-around items-center`}>
        <Picker
          style={styles.pickerStyle}
          pickerData={hours}
          selectedValue={selectedHour}
          onValueChange={setSelectedHour}
          textColor="#FFFFFF"
          itemTextSize={20}
        />
        <Text style={tw`text-white text-xl mx-1`}>:</Text>
        <Picker
          style={styles.pickerStyle}
          pickerData={minutes}
          selectedValue={selectedMinute}
          onValueChange={setSelectedMinute}
          textColor="#FFFFFF"
          itemTextSize={20}
        />
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
  );
};

const styles = StyleSheet.create({
  pickerStyle: {
    height: 215,
    width: 100,
    backgroundColor: "#4D4471",
  },
});

export default TimePickerComponent;