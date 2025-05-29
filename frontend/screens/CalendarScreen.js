import React, { useState, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { Calendar } from "react-native-calendars";
import tw from "tailwind-react-native-classnames";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from '@env';

const painDescriptions = [
  "No pain",
  "Minor, occasional discomfort",
  "Slight discomfort",
  "Noticeable but manageable",
  "Distracting",
  "Hard to ignore",
  "Constant but functional",
  "Sleep-disrupting",
  "Severe with nausea",
  "Extremely severe",
  "Unconscious"
];

export default function CalendarScreen({ navigation }) {
  const now = new Date();

  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(null);
  const [logsByDate, setLogsByDate] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [currentMonth, setCurrentMonth] = useState({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  });

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const { year, month } = currentMonth;

        const res = await fetch(`${BASE_URL}/migraines/month?year=${year}&month=${month}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await res.json();

        const logs = {};
        const marks = {};

        data.forEach(log => {
          const dateStr = log.start_time.split("T")[0];

          if (!logs[dateStr]) {
            logs[dateStr] = [];
          }
          logs[dateStr].push(log);

          marks[dateStr] = { marked: true, dotColor: "#8191FF" };
        });

        setLogsByDate(logs);
        setMarkedDates(marks);
      } catch (err) {
        console.error("Failed to fetch logs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [currentMonth]);

  if (loading) {
    return (
      <View style={[styles.container, tw`flex-1`]}>
        <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>Calendar</Text>
        <View style={[tw`flex-1 justify-center items-center`]}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </View>
    );
  }
  
  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const handleMonthChange = (monthData) => {  
    setLoading(true);
    setCurrentMonth({ year: monthData.year, month: monthData.month });
  };

  const handleLogPress = (log) => {
    navigation.navigate("MigraineDetail", { logId: log.id, fromCalendar: true });
  };

  return (
    <View style={[styles.container, tw`flex-1`]}>
      <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>Calendar</Text>

      <Calendar
        current={`${currentMonth.year}-${String(currentMonth.month).padStart(2, '0')}-01`}
        style={styles.calendar}
        markedDates={{
          ...markedDates,
          ...(selectedDate ? { [selectedDate]: { selected: true, selectedColor: "#8191FF" } } : {}),
        }}
        onDayPress={handleDayPress}
        onMonthChange={handleMonthChange}
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

      {selectedDate && logsByDate[selectedDate] && (
        <ScrollView style={[styles.card, tw`mx-5 mt-5 p-5 mb-10`]}>
          <Text style={tw`text-white text-lg font-bold mb-4`}>
            Logs for {selectedDate}
          </Text>
          {logsByDate[selectedDate].map((log) => (
            <TouchableOpacity
              key={log.id} // unique key for each log or else react will throw a warning
              onPress={() => handleLogPress(log)}
              style={tw`border-b border-gray-200 py-3`}
            >
              <Text style={tw`text-white text-base`}>
                {new Date(log.start_time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} — {painDescriptions[log.pain_level] ?? "Unknown pain"}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
