import React, { useState } from "react";
import { ScrollView, View, Image, Text, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";

export default function HomeScreen() {
  const [progress, setProgress] = useState("0%");
  let name = "djeck" // placeholder, needs logic to update based on account
  return (
    <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>

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
        {[5, "Now", 7, 8, 9].map((label, index) => (
          <View key={index} style={styles.weatherCard}>
            <Text style={styles.weatherTime}> 
            {label === "Now" ? "Now" : `${label} AM`}
            </Text>
          </View>
        ))}
      </ScrollView>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#39345B",
    paddingHorizontal: 24,
    paddingTop: 80,
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
    fontWeight: 500
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
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6A6DCD',
    borderRadius: 8,
  },
  weatherCard: {
    backgroundColor: '#48319D33',
    borderRadius: 30,
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 8,
    paddingLeft: 8,
    alignItems: 'center',
    marginRight: 12,
    width: 60,
    height: 146,
    borderColor: '#827BB9',
    borderWidth: 1
  },
  weatherTime: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  }
});