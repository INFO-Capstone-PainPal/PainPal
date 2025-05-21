import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import tw from "tailwind-react-native-classnames";
import Slider from '@react-native-community/slider';

export default function LoggingScreen({navigation, route}) {
    const { initialSelected = 0, initialAreas = [], onSave } = route.params;
    const [selectedRegions, setSelectedRegions] = React.useState(initialAreas || []);
    const [painLevel, setPainLevel] = React.useState(initialSelected);

    const painDescriptions = [
        "0 - No pain",
        "1 - Minor, occasional discomfort",
        "2 - Slightly stronger occasional discomfort",
        "3 - Noticeable but manageable.",
        "4 - Can be ignored but still distracting.",
        "5 - Cannot be ignored for long.",
        "6 - Constant pain but still able to work/socialize.",
        "7 - Hard to concentrate, affects sleep.",
        "8 - Limited physical activity, nausea, dizziness.",
        "9 - Unable to speak, moaning in pain.",
        "10 - Unconscious due to pain."
    ];

    const frontRegions = [
        [
            { id: 0, src: require("../assets/topleft.png") },
            { id: 1, src: require("../assets/topright.png") },
        ],
        [
            { id: 2, src: require("../assets/midleft.png") },
            { id: 3, src: require("../assets/midright.png") },
        ],
        [
            { id: 4, src: require("../assets/botleft.png") },
            { id: 5, src: require("../assets/botright.png") },
        ],
        [
            { id: 6, src: require("../assets/chin.png") },
        ]
    ];

    const backRegions = [
        [
            { id: 7, src: require("../assets/backtopleft.png") },
            { id: 8, src: require("../assets/backtopright.png") },
        ],
        [
            { id: 9, src: require("../assets/backmidleft.png") },
            { id: 10, src: require("../assets/backmidright.png") },
        ],
        [
            { id: 11, src: require("../assets/backbotleft.png") },
            { id: 12, src: require("../assets/backbotright.png") },
        ],
        [
            { id: 13, src: require("../assets/neck.png") },
        ]
    ];

    return (
        <ScrollView contentContainerStyle={[styles.container, tw`justify-center px-6`, { flexGrow: 1 }]} style={{ backgroundColor: "#39345B" }}>
            <Text style={[tw`text-white font-bold`, styles.heading]}>
                Pain Map
            </Text>

            <View style={{ alignItems: 'center', marginTop: 20 }}>
                <FaceStack regionMap={frontRegions} onRegionPress={setSelectedRegions} selectedRegions={selectedRegions} />
                <FaceStack regionMap={backRegions} onRegionPress={setSelectedRegions} selectedRegions={selectedRegions} />
            </View>

            <View style={[tw`justify-center`, styles.card]}>
                <Text style={[tw`text-white font-bold`, styles.cardTitle]}>Pain Level</Text>
                <Slider
                    style={{ width: 257, height: 20, marginTop: 60 }}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    value={painLevel}
                    onValueChange={setPainLevel}
                    minimumTrackTintColor="#675FA6"
                    maximumTrackTintColor="#DAD6EB"
                    thumbTintColor="#675FA6"
                />
                <View style={{ height: 80, width: 300, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[tw`text-white font-bold`, styles.cardText]}>
                        {painDescriptions[painLevel]}
                    </Text>
                </View>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 24, marginHorizontal: 20 }}>
                <TouchableOpacity 
                    style={styles.nextButton} 
                    onPress={() => { 
                        onSave(painLevel, selectedRegions);
                        navigation.goBack();
                    }
                }>
                    <Text style={tw`text-white text-center font-bold text-lg`}>
                        Save
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39345B",
    flexGrow: 1
  },
  pacifico: {
    fontFamily: "Pacifico"
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
    position: 'absolute',
    top: 24,
    left: 16
  },
  card: {
    backgroundColor: "#443E6E",
    borderRadius: 14,
    width: 350,
    height: 230,
    alignSelf: "center",
    marginTop: 100,
    alignItems: "center"
  },
  cardText: {
    fontFamily: 'FunnelSansBold',
    fontSize: 20,
    color: "#DAD6EB",
    marginTop: 30
  },
  nextButton: {
    backgroundColor: "#8191FF",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: 'flex-end'
  },
  fContainer: {
    marginTop: 20,
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    padding: 0,
    margin: 0,
  },
  regionImage: {
    width: 115,
    height: 80,
    resizeMode: 'stretch',
    margin: 0,
    padding: 0,
  },
  fullWidthRegionImage: {
    width: 200,
    height: 80,
    resizeMode: 'stretch',
    marginLeft: 22,
    padding: 0,
  },
  selectedRegion: {
    borderWidth: 2,
    borderColor: "#8191FF",
    borderRadius: 4,
  }
});

// helper function that styles the head map images to form the full head and handles selections
function FaceStack({ regionMap, onRegionPress, selectedRegions }) {
    return (
        <View style={styles.fContainer}>
            {regionMap.map((row, rowIndex) => (
                <View key={rowIndex} style={styles.row}>
                    {row.map((region, colIndex) => (
                        <TouchableOpacity key={colIndex} onPress={() => {
                            onRegionPress((currSelection) =>{
                                if (currSelection.includes(region.id)) {
                                    return currSelection.filter((selectedId) => selectedId !== region.id);
                                } else {
                                    return [...currSelection, region.id];
                                };
                            })
                        }}>
                            <Image 
                                source={region.src} 
                                style={[
                                    row.length === 1 ? styles.fullWidthRegionImage : styles.regionImage,
                                    region.id === 10 ? { width: 126 } : null,
                                    region.id === 13 ? { marginLeft: 15, width: 206 } : null,
                                    selectedRegions.includes(region.id) ? styles.selectedRegion : null
                                ]}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            ))}
        </View>
    );
}

