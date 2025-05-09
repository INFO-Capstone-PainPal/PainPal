import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Text, ActivityIndicator } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimePickerComponent from '../components/TimePickerComponent';

const BASE_URL = "http://localhost:8000";

// For Android emulator, use this instead:
// const BASE_URL = "http://10.0.2.2:8000";

export default function MigraineDetailScreen({ route, navigation }) {
  const { logId } = route.params;

  const [loading, setLoading] = useState(true);

  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date());
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [painLevel, setPainLevel] = useState(0);

  const [symptomOptions, setSymptomOptions] = useState([]);
  const [triggerOptions, setTriggerOptions] = useState([]);
  const [medicationOptions, setMedicationOptions] = useState([]);

  const extractIds = (arr) => arr.map(item => item.id);
  const mapOptions = (arr) => arr.map(item => ({ id: item.id, label: item.name }));

  useEffect(() => {
    const fetchLogAndOptions = async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');

        // data for log
        const resLog = await fetch(`${BASE_URL}/migraines/${logId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resLog.json();

        setStartDateTime(new Date(data.start_time));
        setEndDateTime(new Date(data.end_time));
        setPainLevel(data.pain_level);
        setSelectedSymptoms(extractIds(data.symptoms));
        setSelectedTriggers(extractIds(data.triggers));
        setSelectedMeds(extractIds(data.medications));

        // list options
        const resOpts = await fetch(`${BASE_URL}/options/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const opts = await resOpts.json();
        setSymptomOptions(mapOptions(opts.symptoms));
        setTriggerOptions(mapOptions(opts.triggers));
        setMedicationOptions(mapOptions(opts.medications));
      } catch (err) {
        console.error('Failed to load migraine detail or options', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLogAndOptions();
  }, [logId]);

  if (loading) {
    return (
      <View style={[styles.container, tw`flex-1 justify-center items-center`]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  const formatDateForApi = (dt) => {
    const pad = (n) => n.toString().padStart(2, '0');
    return (
      `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())}` +
      `T${pad(dt.getHours())}:${pad(dt.getMinutes())}:00`
    );
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      await fetch(`${BASE_URL}/migraines/${logId}/complete`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          start_time: formatDateForApi(startDateTime),
          end_time: formatDateForApi(endDateTime),
          pain_level: painLevel,
          symptoms: selectedSymptoms,
          triggers: selectedTriggers,
          medications: selectedMeds,
        }),
      });
      navigation.goBack();
    } catch (err) {
      console.error('Failed to save migraine', err);
    }
  };

  return (
    <View style={[styles.container, tw`flex-1`]}>
      <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>Log Overview</Text>
  
      <ScrollView contentContainerStyle={tw`px-5 pt-5 pb-10`}>
        <View style={[styles.card, tw`mb-4`]}>
          <TimePickerComponent
            title="Start Time"
            initialDateTime={startDateTime}
            onDateTimeChange={setStartDateTime}
          />
        </View>
  
        <View style={[styles.card, tw`mb-4`]}>
          <TimePickerComponent
            title="End Time"
            initialDateTime={endDateTime}
            onDateTimeChange={setEndDateTime}
          />
        </View>
  
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
          <Text style={tw`text-white`}>
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
          <Text style={tw`text-white`}>
            Triggers ({selectedTriggers.length})
          </Text>
        </TouchableOpacity>
  
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("MultiSelect", {
              title: "Medications",
              options: medicationOptions,
              initialSelected: selectedMeds,
              onSave: setSelectedMeds,
            })
          }
          style={styles.selectorButton}
        >
          <Text style={tw`text-white`}>
            Medications ({selectedMeds.length})
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
  
        <View style={tw`flex-row justify-between items-center mt-6`}>
          <TouchableOpacity style={styles.saveButton} onPress={() => navigation.goBack()}>
            <Text style={tw`text-white text-center font-bold text-lg`}>
              Cancel
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={tw`text-white text-center font-bold text-lg`}>
              Save Log
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );  
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39345B",
    flex: 1,
  },
  card: {
    backgroundColor: "#4D4471",
    borderRadius: 12,
    padding: 16,
  },
  selectorButton: {
    backgroundColor: "#4D4471",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: "#8191FF",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});