import React, { useState, useEffect } from "react";
import { ScrollView, View, Image, Text, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";
import * as Location from 'expo-location';
import { SvgUri } from 'react-native-svg';
import { GOOGLE_API_KEY } from '@env';


export default function HomeScreen() {
  const [progress, setProgress] = useState("0%");
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  let name = "djeck"; // Placeholder

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
    })();
  }, []);

  // call weather API with location 
  useEffect(() => {
    if (location) {
      weatherApiAsync();
    }
  }, [location]);

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

  return (
    <ScrollView contentContainerStyle={[styles.container, tw`justify-center px-6`, { flexGrow: 1 }]} style={{ backgroundColor: "#39345B" }}>
      <Text style={[tw`font-bold`, styles.header]}>
        Hello, {name}!
      </Text>

      <View style={tw`mb-6 flex-row items-center justify-around`}>
        <Image source={require("../assets/PainPal_Logo.png")} style={styles.logo} />
        <Text style={[tw`font-bold`, styles.msg]}>
          Fill out your first log today!
        </Text>
      </View>

      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: progress }]} />
      </View>

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
    width: 120,
    fontWeight: '500'
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 180,
    marginTop: 30
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
});