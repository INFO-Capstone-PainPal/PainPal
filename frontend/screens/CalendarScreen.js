import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import tw from "tailwind-react-native-classnames";

export default function CalendarScreen({ navigation }) {
	const [selectedDate, setSelectedDate] = useState(null);

  // dummy data: keys are date strings, values are arrays of logs
  const dummyLogs = {
    "2025-04-11": [
      { id: "log1", title: "Migraine Log: 6:28 AM - Severe" },
      { id: "log2", title: "Migraine Log: 7:15 AM - Moderate" },
    ],
    "2025-04-15": [
      { id: "log3", title: "Migraine Log: 9:00 AM - Mild" },
    ],
  };

  // dates that will be dotted, revised when api call added
  const markedDates = {};
  const logDates = Object.keys(dummyLogs);
	
	logDates.forEach(date => {
    markedDates[date] = { marked: true, dotColor: "#8191FF" };
  });

  // selects a date when pressed, day is something in third party library from onDayPress
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  // nav to logging screen with log data
  const handleLogPress = (log) => {
    navigation.navigate("Logging", { log });
  };

  return (
    <View style={[styles.container, tw`flex-1`]}>
      <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>Calendar</Text>
      
      <Calendar
        style={styles.calendar}
        markedDates={{
          ...markedDates,
          ...(selectedDate ? { [selectedDate]: { selected: true, selectedColor: "#8191FF" } } : {}),
        }}
        onDayPress={handleDayPress}
        theme={{
          calendarBackground: "#39345B",
          backgroundColor: "#FFFFFF",
          textSectionTitleColor: "#FFFFFF",
          dayTextColor: "#FFFFFF",
          monthTextColor: "#FFFFFF",
          arrowColor: "#FFFFFF",
          todayTextColor: "#8191FF",
        }}
      />

      {/* conditionally render logs for selected date */}
      {selectedDate && dummyLogs[selectedDate] && (
        <View style={[styles.card, tw`mx-5 mt-5 p-5`]}>
          <Text style={tw`text-white text-lg font-bold mb-4`}>
            Logs for {selectedDate}
          </Text>
          {dummyLogs[selectedDate].map((log) => (
            <TouchableOpacity
              key={log.id} // unique key for each log or else react will throw a warning
              onPress={() => handleLogPress(log)}
              style={tw`border-b border-gray-200 py-3`}
            >
              <Text style={tw`text-white text-base`}>{log.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39345B",
  },
  calendar: {
		marginTop: 10,
    marginHorizontal: 20,
    borderRadius: 12,
  },
  card: {
    backgroundColor: "#4D4471",
    borderRadius: 12,
  },
});
