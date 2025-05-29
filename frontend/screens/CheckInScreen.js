import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import tw from "tailwind-react-native-classnames";
import { OPENWEATHER_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimePickerComponent from "../components/TimePickerComponent";
import { BASE_URL } from '@env';

export default function CheckInScreen({ route, navigation }) {
    const [sleepDateTime, setSleepDateTime] = useState(new Date());
    const [awakeDateTime, setAwakeDateTime] = useState(new Date());
    const [medicationOptions, setMedicationOptions] = useState([]);
    const [selectedMedications, setSelectedMedications] = useState([]);
    const { onCheckInSaved } = route.params;

    const pad = (n) => n.toString().padStart(2, "0");

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const token = await AsyncStorage.getItem("access_token");
                const res = await fetch(`${BASE_URL}/options/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                const data = await res.json();
    
                setMedicationOptions(data.medications.map((item) => ({ id: item.id, label: item.name })));
            } catch (err) {
                console.error("Failed to fetch options", err);
            }
        };
        fetchOptions();
    }, []);

    const handleSave = async () => {
        try {
            const locationString = await AsyncStorage.getItem("user_location");
            const location = locationString ? JSON.parse(locationString) : null;
            const { latitude, longitude } = location.coords;
    
            const weather = await fetchWeatherData(latitude, longitude, sleepDateTime);
            weather.pressure = weather.pressure * 0.02953; // Convert hPa to inHg
    
            // format the date and time (diff then in quicklog)
            const formatTime = (date) => `${pad(date.getHours())}:${pad(date.getMinutes())}:00`;
          
            const timeWentToBed = formatTime(sleepDateTime);
            const timeWokeUp = formatTime(awakeDateTime);
    
            const token = await AsyncStorage.getItem("access_token");
    
            const res = await fetch(`${BASE_URL}/check-in/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                // had_migraine default 0 for now until backend fix
                body: JSON.stringify({
                    had_migraine: 0, 
                    weather: weather,
                    medications: selectedMedications,
                    time_went_to_bed: timeWentToBed,
                    time_woke_up: timeWokeUp
                }), 
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.detail || "Could not post daily log");
            }
            if (onCheckInSaved) onCheckInSaved();
            navigation.navigate("Main", { screen: "Home" });
        } catch (e) {
            console.error("Daily Log error", e);
        }
    };

    const fetchWeatherData = async (lat, lon, date) => {
        try {
            const unix_time = Math.floor(date.getTime() / 1000);
        
            const weatherRes = await fetch(
                `https://history.openweathermap.org/data/2.5/history/city?lat=${lat}&lon=${lon}&type=hour&appid=${OPENWEATHER_API_KEY}&start_time=${unix_time}&cnt=1&units=imperial`
            );
              
            const weatherData = await weatherRes.json();
              
            if (!weatherRes.ok) {
                throw new Error(weatherData || "Could not fetch weather data");
            } else {
                return {
                    temperature: weatherData.list[0].main.temp,
                    humidity: weatherData.list[0].main.humidity,
                    description: weatherData.list[0].weather[0].description,
                    pressure: weatherData.list[0].main.pressure,
                    latitude: lat,
                    longitude: lon
                }
            } 
        } catch (error) {
            console.error("Weather fetch error:", error.message);
            return null;
        }
    };

    return (
        <View style={[styles.container, tw`flex-1`]}>
            <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>
                Daily Log
            </Text>
            <View style={[styles.card, tw`mx-5 mt-5 p-5`]}>
                <TimePickerComponent
                    title="Time you slept yesterday"
                    initialDateTime={sleepDateTime}
                    onDateTimeChange={setSleepDateTime}
                />
            </View>
            <View style={[styles.card, tw`mx-5 mt-5 p-5`]}>
                <TimePickerComponent
                    title="Time you woke up today"
                    initialDateTime={awakeDateTime}
                    onDateTimeChange={setAwakeDateTime}
                />
            </View>

            <View style={tw`mt-6 mx-5 my-4`}>
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
                    <Text style={tw`text-white`}>
                        Medications ({selectedMedications.length})
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={tw`flex-row justify-between items-center mt-6 mx-5`}>
                <TouchableOpacity style={styles.nextButton} onPress={handleSave}>
                    <Text style={tw`text-white text-center font-bold text-lg`}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: "#39345B",
    },
    card: {
      backgroundColor: "#4D4471",
      borderRadius: 12,
    },
    selectorButton: {
      backgroundColor: "#4D4471",
      borderRadius: 8,
      padding: 12,
      marginBottom: 10,
    },
    nextButton: {
      backgroundColor: "#8191FF",
      borderRadius: 8,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
  });
  