import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Checkbox from 'expo-checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';


export function AppSettingsScreen({ navigation }) {

  return (
    <View style={[styles.container, tw`flex-1 px-6`]}>
      <TouchableOpacity style={styles.arrow} onPress={() => {navigation.goBack()}}>
        <FontAwesomeIcon icon={faArrowLeft} size={36} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={[tw`font-bold`, styles.header]}>
          App Settings
      </Text>
      <View style={styles.menuContainer}>
        {["Language", "Notifications", "Colorblind Mode"].map((label) => {
          return (
            <TouchableOpacity
              key={label}
              style={styles.menuButton}
              onPress={() => {return}}
            >
              <Text style={styles.menuText}>
                {label}
              </Text>
              <Text style={styles.chevron}>
                <FontAwesomeIcon icon={faChevronRight} size={18} color="#FFFFFF" />
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function ProfileSettingsScreen({ navigation }) {

  return (
    <View style={[styles.container, tw`flex-1 px-6`]}>
      <TouchableOpacity style={styles.arrow} onPress={() => {navigation.goBack()}}>
        <FontAwesomeIcon icon={faArrowLeft} size={36} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={[tw`font-bold`, styles.header]}>
        Profile Settings
      </Text>
      <View style={styles.menuContainer}>
        {["Email", "Password", "Delete Account"].map((label) => {

          const isDeleteButton = label === "Delete Account";

          const handlePress = async () => {
            if (isDeleteButton) {
              navigation.navigate("Delete")
            } else {
              navigation.navigate(label);
            }
          };

          return (
            <TouchableOpacity
              key={label}
              style={[styles.menuButton, isDeleteButton && styles.deleteButton]}
              onPress={handlePress}
            >
              <Text style={styles.menuText}>
                {label}
              </Text>
              <Text style={styles.chevron}>
                <FontAwesomeIcon icon={faChevronRight} size={18} color="#FFFFFF" />
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export function ChangePasswordScreen({navigation}) {
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [showText, setShowText] = useState(false);

  return (
    <View style={[styles.container, tw`flex-1 px-6`]}>
      <TouchableOpacity style={styles.arrow} onPress={() => {navigation.goBack()}}>
        <FontAwesomeIcon icon={faArrowLeft} size={36} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={[tw`font-bold`, styles.header]}>
        Update Password
      </Text>
      
      <TextInput
        style={[styles.input, tw`h-12 mb-6`]}
        placeholder="Current Password"
        placeholderTextColor="#999"
        autoCapitalize="none"
        secureTextEntry
      />
      <TextInput
        style={[styles.input, tw`h-12 mb-6`]}
        placeholder="New Password"
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={[styles.input, tw`h-12 mb-6`]}
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={confirmedPassword}
        onChangeText={setConfirmedPassword}
        secureTextEntry
      />

      {showText ?
        <View>
          <Text style={tw`text-white text-center`}>
            Passwords do not match. Try again!
          </Text>
        </View> : null
      }

      <TouchableOpacity style={styles.updateButtonPW} onPress={async () => {
        if (password === confirmedPassword) {
          try {
            const token = await AsyncStorage.getItem("access_token");
            if (token) {
              await fetch(`${BASE_URL}/users/users/me/update`, {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({password: password})
              });
            }
            navigation.goBack();
          } catch (err) {
            console.error("Password update failed", err);
          }
        } else {
          setShowText(true);
        }
      }}>
        <Text style={tw`text-white text-center font-bold text-lg`}>Update</Text>
      </TouchableOpacity>
    </View>
  );
}

export function ChangeEmailScreen({navigation}) {
  const [email, setEmail] = useState("");
  const [confirmedEmail, setConfirmedEmail] = useState("");
  const [showText, setShowText] = useState(false);

  return (
    <View style={[styles.container, tw`flex-1 px-6`]}>
      <TouchableOpacity style={styles.arrow} onPress={() => {navigation.goBack()}}>
        <FontAwesomeIcon icon={faArrowLeft} size={36} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={[tw`font-bold`, styles.header]}>
          Update Email
      </Text>

      <TextInput
        style={[styles.input, tw`h-12 mb-6`]}
        placeholder="New Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, tw`h-12 mb-6`]}
        placeholder="Confirm Email"
        placeholderTextColor="#999"
        autoCapitalize="none"
        value={confirmedEmail}
        onChangeText={setConfirmedEmail}
      />

      {showText ? 
          <View>
            <Text style={tw`text-white text-center`}>
              Emails do not match. Try again!
            </Text>
          </View> : null}

      <TouchableOpacity style={styles.updateButton} onPress={async () => {
        if (email === confirmedEmail) {
          try {
            const token = await AsyncStorage.getItem("access_token");
            if (token) {
              await fetch(`${BASE_URL}/users/users/me/update`, {
                method: "PUT",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({email: email})
              });
            }
            navigation.goBack();
          } catch (err) {
            console.error("Email update failed", err);
          }
        } else {
          setShowText(true);
        }
      }}>
        <Text style={tw`text-white text-center font-bold text-lg`}>Update</Text>
      </TouchableOpacity>
    </View>
  );
}

export function DeleteAccountScreen({navigation}) {
  const [isChecked, setChecked] = useState(false);

  return (
    <View style={[styles.container, tw`flex-1 px-6`]}>
      <TouchableOpacity style={styles.arrow} onPress={() => {navigation.goBack()}}>
        <FontAwesomeIcon icon={faArrowLeft} size={36} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={[tw`font-bold`, styles.header]}>
        Delete Account
      </Text>
      <View style={styles.section}>
        <Text style={[tw`text-white text-right`, styles.msg]}>
          Are you sure you want to delete your account? You will not be able to recover your account after confirmation.
        </Text>
      </View>
      <View style={styles.section}>
        <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} />
        <Text style={[tw`text-white text-right`]}>
          Yes, permanently delete my account
        </Text>
      </View>

      <TouchableOpacity style={styles.updateButton} disabled={!isChecked} onPress={async () => {
        try {
          const token = await AsyncStorage.getItem("access_token");
          if (token) {
            await fetch(`${BASE_URL}/users/me/delete`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          await AsyncStorage.removeItem("access_token");
          await AsyncStorage.removeItem("user_location");
          
          navigation.navigate("Login");
        } catch (err) {
          console.error("Deletion failed", err);
        }}
      }>
        <Text style={tw`text-white text-center font-bold text-lg`}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#39345B"
  },
  header: {
    fontFamily: 'FunnelSansBold',
    color: 'white',
    fontSize: 30,
    marginBottom: 50
  },
  menuContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#5A4D88',
  },
  menuButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderColor: '#5A4D88',
  },
  menuText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'FunnelSansBold'
  }, 
  deleteButton: {
    marginTop: 250,
    borderTopWidth: 1,
    borderColor: '#5A4D88'
  },
  arrow: {
    marginTop: 80,
    marginBottom: 20
  },
  input: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#6A7DFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 50
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    margin: 8,
  },
  msg: {
    textAlign: "left",
    marginBottom: 50
  },
  updateButton: {
    backgroundColor: "#6A7DFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 350
  },
  updateButtonPW: {
    backgroundColor: "#6A7DFF",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 250
  }
});
