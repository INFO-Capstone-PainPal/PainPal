import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import tw from 'tailwind-react-native-classnames';

export default function TimePickerComponent({ title, initialDateTime = new Date(), onDateTimeChange }) {
  const [time, setTime] = useState(initialDateTime);
  const [show, setShow] = useState(Platform.OS === 'ios');

  const handleChange = (event, selectedTime) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selectedTime) {
      setTime(selectedTime);
      onDateTimeChange?.(selectedTime);
    }
  };

  const openPicker = () => setShow(true);

  return (
    <View>
      <Text style={tw`text-white text-lg font-bold mb-2`}>{title}</Text>

      {/* Android requires modal, can't directly render*/}
      {Platform.OS === 'android' && (
        <TouchableOpacity
          style={[tw`py-4 px-4 mb-2`, {backgroundColor: '#39345B' }]}
          onPress={openPicker}
        >
          <Text style={tw`text-white text-base`}>
            {time.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </TouchableOpacity>
      )}

      {show && (
        <DateTimePicker
          value={time}
          mode="time"
          display="spinner"
          onChange={handleChange}
          textColor="#FFFFFF"  
          style={styles.picker}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  picker: {
    backgroundColor: 'transparent',
  },
});
