import React, { useState, useEffect } from "react";
import { ScrollView, View, Image, Text, StyleSheet, TouchableOpacity} from "react-native";
import tw from "tailwind-react-native-classnames";
import * as Location from 'expo-location';
import { SvgUri } from 'react-native-svg';
import { GOOGLE_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

export default function HomeScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [name, setName] = useState("user");
  const [logStatus, setLogStatus] = useState(null);
  const [unfinishedId, setUnfinishedId] = useState(null);
  const [displayCheckIn, setCheckInStatus] = useState(true);

  // fetches log status when home page is focused
  useEffect(() => {
    const refresh = navigation.addListener("focus", () => {
      fetchLogStatus();
    });
  
    return refresh;
  }, [navigation]);

  // location permission and data
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('location access was denied');
        return errorMsg;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
      // set location and name upon page load
      await AsyncStorage.setItem("user_location", JSON.stringify(loc));
      fetchName();
      fetchStreak();
      fetchCheckInStatus();
    })();
  }, []);

  // call weather API with location 
  useEffect(() => {
    if (location) {
      weatherApiAsync();
    }
  }, [location]);

  // fetch user's name
  const fetchName = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      const response = await fetch(`${BASE_URL}/users/me/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const data = await response.json();
      setName(data.full_name);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch weather
  const weatherApiAsync = async () => {
    if (!location || !location.coords) {
      console.warn("Location data not ready yet.");
      return;
    }

    const { latitude, longitude } = location.coords;

    try {
      const response = await fetch(
        `https://weather.googleapis.com/v1/forecast/hours:lookup?key=${GOOGLE_API_KEY}&location.latitude=${latitude}&location.longitude=${longitude}&unitsSystem=IMPERIAL&hours=10`
      );
      const json = await response.json();
      setWeatherData(json);
    } catch (error) {
      console.error("error fetching data:", error);
    }
  };

  // fetch whether there is a migraine log that needs to be finished
  const fetchLogStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      const response = await fetch(`${BASE_URL}/migraines/migraines/unfinished`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch log status");
      }

      const data = await response.json();
      if (data?.end_time === null) {
        setLogStatus(data);
        setUnfinishedId(data.id);
      }
    } catch (error) {
      console.error("Error fetching log data:", error);
    }
  };

  const fetchCheckInStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      const response = await fetch(`${BASE_URL}/check-in/checkin/today`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch check in status");
      }

      const data = await response.json();
      if (data?.has_checked_in) {
        setCheckInStatus(false);
      }
    } catch (error) {
      console.error("Error fetching check in data:", error);
    }
  };

  // fetch streak number
  const fetchStreak = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");

      const response = await fetch(`${BASE_URL}/check-in/streak`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch streak number");
      }

      const data = await response.json();
      setCurrentStep(data);
    } catch (error) {
      console.error("Error fetching streak:", error.message);
    }
  }

  const handleLogPress = () => {
    navigation.navigate("MigraineDetail", { logId: unfinishedId });
  };

  const handleCheckInPress = () => {
    navigation.navigate("CheckIn", { logId: unfinishedId, onCheckInSaved: () => setCheckInStatus(false)});
  };
  
  return (
    <ScrollView contentContainerStyle={[styles.container, tw`justify-center px-6`, { flexGrow: 1 }]} style={{ backgroundColor: "#39345B" }}>
      <Text style={[tw`font-bold`, styles.header]}>
        Hello, {name}!
      </Text>

      <View style={[tw`mb-6 flex-row`, { alignItems: 'center' }]}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Image source={require("../assets/PainPal_Logo.png")} style={styles.logo} />
        </View>

        {displayCheckIn ?
          <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <Text style={styles.msg}>
              Logging daily will allow you access to data-driven insights. Don't forget to fill out your daily log!
            </Text>

            <TouchableOpacity onPress={handleCheckInPress} style={styles.checkInButton}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Continue</Text>
            </TouchableOpacity>
          </View> :  <View style={{ flex: 1, justifyContent: 'space-between' }}>
            <Text style={styles.msg}>
              Good work filling out your daily log! Logging daily will allow you access to data-driven insights.
            </Text>
          </View>}
      </View>

      <View style={tw`flex-row justify-center mt-4`}>
        {[1, 2, 3, 4, 5, 6, 7].map((step, index) => {
          const isActive = step <= currentStep;
          return (
            <View key={step} style={tw`flex-row items-center`}>
              <View style={[tw`w-8 h-8 rounded-full items-center justify-center`, {
                backgroundColor: isActive ? '#827BB9' : 'transparent',
                borderColor: '#827BB9',
                borderWidth: 2,
              }]}>
                <Text style={{ color: isActive ? 'white' : '#827BB9', fontWeight: 'bold' }}>{step}</Text>
              </View>
              {index !== 6 && (
                <View style={{ height: 2, width: 26, backgroundColor: '#827BB9' }} />
              )}
            </View>
          )
        })}
      </View>

      {logStatus && (
        <View style={styles.popup}>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: 16, marginBottom: 8 }}>
            Hey!
          </Text>
          <Text style={{ color: 'white', marginBottom: 12 }}>
            You have an unfinished log. Complete it and keep your migraine tracking up-to-date!
          </Text>
          <TouchableOpacity
            onPress={handleLogPress}
            style={styles.popupButton}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView horizontal style={tw`mt-10`} showsHorizontalScrollIndicator={false}>
        {weatherData?.forecastHours?.slice(0, 10).map((hour, index) => {
          const temp = Math.round(hour.temperature?.degrees) ?? "--";
          const condition = hour.weatherCondition?.description?.text ?? "Unknown";
          const iconUrl = `${hour.weatherCondition?.iconBaseUri}.svg`;

          const hourNum = hour.displayDateTime?.hours;
          const label = index === 0 ? "Now" : `${(hourNum % 12 || 12)} ${hourNum >= 12 ? "PM" : "AM"}`;
          var isNow;
          if (label === "Now") {
            isNow = true;
          }

          return (
            <View key={index} style={[isNow? styles.now : styles.future, styles.weatherCard]}>
              <Text style={styles.weatherTime}>{label}</Text>
              <SvgUri style={styles.weatherIcon} uri={iconUrl} accessible={true} accessibilityLabel={condition}/>
              <Text style={styles.weatherTemp}>{temp}&deg;</Text>
            </View>
          );
        })}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#39345B",
    paddingHorizontal: 24,
    paddingTop: 80
  },
  header: {
    fontFamily: 'FunnelSansBold',
    color: 'white',
    fontSize: 30,
    marginBottom: 20
  },
  msg: {
    fontFamily: 'FunnelSansBold',
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: "center",
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 180,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#307FE24D',
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6A6DCD',
    borderRadius: 8
  },
  future: {
    backgroundColor: '#48319D33'
  },
  now: {
    backgroundColor: '#86B6FF'
  },
  weatherCard: {
    borderRadius: 30,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 8,
    paddingLeft: 8,
    alignItems: 'center',
    marginRight: 12,
    width: 70,
    height: 150,
    borderColor: '#827BB9',
    borderWidth: 1
  },
  weatherTime: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  weatherIcon: {
    width: 40,
    height: 40,
    marginTop: 20,
    marginBottom: 20
  },
  weatherTemp: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 24
  },
  checkInButton: {
    alignSelf: 'center',
    marginTop: 12,
    backgroundColor: '#675FA6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12
  },
  popup: {
    backgroundColor: '#4B3F72',
    padding: 16,
    borderRadius: 16,
    marginTop: 24
  },
  popupButton: {
    alignSelf: 'flex-end',
    marginTop: 12,
    backgroundColor: '#675FA6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 12,
  }
});