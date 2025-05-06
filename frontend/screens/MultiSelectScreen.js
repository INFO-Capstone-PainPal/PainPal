import React, { useState } from "react";
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";

export default function MultiSelectScreen({ route, navigation }) {
  const { title, options, initialSelected, onSave } = route.params;
  const [selected, setSelected] = useState(initialSelected);

  const toggleItem = (id) => {
    const updated = [...selected];
    const index = updated.indexOf(id);
    if (index > -1) {
      updated.splice(index, 1);
    } else {
      updated.push(id);
    }
    setSelected(updated);
  };

  return (
    <View style={[styles.container, tw`flex-1`]}>
      <Text style={tw`text-white text-2xl font-bold mt-14 ml-5`}>{title}</Text>

      <ScrollView style={[styles.card, tw`mx-5 mt-5 px-5`]} contentContainerStyle={{ paddingBottom: 20 }}>
      {options.map((item, index) => {
          const isSelected = selected.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => toggleItem(item.id)}
              style={[
                tw`py-3 border-b border-gray-200`,
                index === options.length - 1 && tw`border-b-0`, // remove last border
              ]}
            >
              <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`text-white text-base`}>{item.label}</Text>
                {isSelected && <Text style={tw`text-white text-base`}>✓</Text>}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        style={[styles.saveButton, tw`mx-5 mt-6 mb-12`]}
        onPress={() => {
          onSave(selected);
          navigation.goBack();
        }}
      >
        <Text style={tw`text-white text-center font-bold text-lg`}>
          Save {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39345B",
  },
  card: {
    backgroundColor: "#4D4471",
    borderRadius: 12,
  },
  saveButton: {
    backgroundColor: "#8191FF",
    borderRadius: 8,
    paddingVertical: 12,
  },
});
