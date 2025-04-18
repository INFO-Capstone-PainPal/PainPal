import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import tw from "tailwind-react-native-classnames";
import Svg, {Path} from 'react-native-svg';
import Slider from '@react-native-community/slider';

export default function LoggingScreen({ }) {

  return (
    <ScrollView contentContainerStyle={[styles.container, tw`justify-center px-6`]}>
       <Text style={[tw`text-white font-bold`, styles.heading]}>
       Pain Map
       </Text>
       <View style={{ alignItems: 'center', top: 20}}>
        <Svg width="200" height="300" viewBox="0 0 218 323" fill="none">
          <Path
            d="M37.0182 262.789L45.5078 241.789H173.383L180.281 262.789C184.172 265.789 191.954 272.089 191.954 273.289C191.954 274.789 162.24 311.789 111.833 318.789C71.5073 324.389 36.6645 290.789 24.2838 273.289L37.0182 262.789Z"
            fill="#DAD6EB"
            stroke="#39345B"
            strokeWidth={6}
          />
          <Path
            d="M100.16 5.28883C13.6717 12.9999 5.71267 84.6222 13.6717 122.289C-4.58101 116.689 4.65147 155.955 11.5493 176.289L23.2225 187.289L26.4062 214.289C41.7936 232.455 75.2215 271.189 85.8336 280.789C96.4456 290.389 117.493 288.455 126.69 286.289C144.094 281.489 177.805 234.622 192.485 211.789L194.076 187.289L206.28 176.289C212.117 171.289 215.3 124.289 213.709 122.289C212.435 120.689 207.695 121.622 206.28 122.289C206.705 7.88883 136.5 -1 100.16 5.28883Z"
            fill="#DAD6EB"
            stroke="#39345B"
            strokeWidth={6}
          />
        </Svg>
      </View>
      <View style={{ alignItems: 'center', top: 40}}>
        <Svg width="200" height="300" viewBox="0 0 208 320" fill="none" style={styles.svg}>
          <Path
            d="M98.9864 3.03673C15.7864 1.03673 6.98642 81.2034 12.9864 121.537C-3.81358 113.137 4.31976 154.037 10.4864 175.537L21.4864 185.537L27.4864 217.037L41.2364 238.287L33.9864 265.037L24.4864 277.037C85.2864 348.237 154.82 306.703 181.986 277.037L173.486 265.037C170.286 264.237 161.153 229.037 156.986 211.537L164.986 234.037L180.486 211.537L185.486 185.537L197 175.5L204 118.037H193.986C193.486 94.5367 202.986 5.53673 98.9864 3.03673Z"
            fill="#DAD6EB"
          />
          <Path
            d="M48.4864 211.537L41.2364 238.287M41.2364 238.287L33.9864 265.037L24.4864 277.037C85.2864 348.237 154.82 306.703 181.986 277.037L173.486 265.037C170.286 264.237 161.153 229.037 156.986 211.537L164.986 234.037L180.486 211.537L185.486 185.537L197 175.5L204 118.037H193.986C193.486 94.5367 202.986 5.53673 98.9864 3.03673C15.7864 1.03673 6.98642 81.2034 12.9864 121.537C-3.81358 113.137 4.31976 154.037 10.4864 175.537L21.4864 185.537Z"
            stroke="#39345B"
            strokeWidth={6}
          />
        </Svg>
      </View>

      <View style={[tw`justify-center`, styles.card]}>
        <Text style={[tw`text-white font-bold`, styles.cardTitle]}>Pain Level</Text>
        <Slider
          style={{width: 257, height: 20,alignItems: "center", }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#675FA6"
          maximumTrackTintColor="#DAD6EB"
          thumbTintColor="#675FA6"
        />
        <Text style={[tw`font-bold`, styles.cardText]}>0 - No pain</Text>
      </View>
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39345B",
    flexGrow: 1
  },
  pacifico: {
    fontFamily: "Pacifico",
  },
  heading: {
    fontFamily: 'FunnelSansBold',
    fontSize: 30,
    marginTop: 100
  },
  cardTitle: {
    fontFamily: 'FunnelSansBold',
    fontSize: 20,
    fontWeight: 600,
    alignSelf: "flex-start",
    marginLeft: 10,
    marginBottom: 40
  },
  card: {
    backgroundColor: "#443E6E",
    borderRadius: 14,
    width: 343,
    height: 200,
    alignSelf: "center",
    marginTop: 100,
    alignItems: "center"
  },
  cardText: {
    fontFamily: 'FunnelSansBold',
    fontSize: 20,
    color: "#DAD6EB"
  },
  saveButton: {
    backgroundColor: "#443E6E",
    borderRadius: 10,
    width: 75,
    height: 45,
    alignSelf: 'flex-end',
    marginTop: 20,
    marginRight: 10
  },
  saveButtonText: {
    color: "#F5F5F5",
    fontSize: 20,
    fontFamily: 'FunnelSansBold',
    textAlign: 'center',
  }
});
