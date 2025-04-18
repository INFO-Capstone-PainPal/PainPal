import React, { useState } from "react";
import { ScrollView, View, Image, Text, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";

export default function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={[styles.container, { flexGrow: 1 }]}>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#39345B",
    paddingHorizontal: 24,
    paddingTop: 80,
  }
});