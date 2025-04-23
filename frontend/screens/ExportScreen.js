import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import tw from "tailwind-react-native-classnames";

export default function ExportScreen({ }) {

  return (
    <View style={[styles.container, tw`flex-1 justify-center px-6`]}>
    <Text>Export</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39345B",
  },
  pacifico: {
    fontFamily: "Pacifico",
  }
});