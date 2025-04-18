import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";
import Svg, {Path} from 'react-native-svg';
import Slider from '@react-native-community/slider';

export default function LoggingScreen({ }) {

  return (
    <ScrollView contentContainerStyle={[styles.container, tw`justify-center px-6`]}>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39345B",
    flexGrow: 1
  }
});
