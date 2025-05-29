import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import tw from "tailwind-react-native-classnames";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '@env';

export default function ProfileScreen({ navigation, route }) {

  const screenMap = {
    "Profile Settings": "ProfileSettings",
    "App Settings": "AppSettings"
  };

  return (
    <View style={[styles.container, tw`flex-1 justify-center px-6`]}>
      <Text style={[tw`font-bold`, styles.header]}>
        Profile
      </Text>
      <View style={tw`mb-6 flex-row items-center justify-around`}>
        <Image source={require("../assets/PainPal_Logo.png")} style={styles.logo} />
      </View>
      <View style={styles.menuContainer}>
        {["Profile Settings", "App Settings", "Logout"].map((label) => {

          const isLogoutButton = label === "Logout";

          const handlePress = async () => {
            if (isLogoutButton) {
              try {
                const token = await AsyncStorage.getItem("access_token");
                if (token) {
                  await fetch(`${BASE_URL}/logout"`, {
                    method: "POST",
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  });
                }

                // Clear info from AsyncStorage
                await AsyncStorage.removeItem("access_token");
                await AsyncStorage.removeItem("user_location");

                navigation.navigate("Login");
              } catch (err) {
                console.error("Logout failed", err);
              }
            } else {
              navigation.navigate(screenMap[label]);
            }
          };

          return (
            <TouchableOpacity
              key={label}
              style={[styles.menuButton, isLogoutButton && styles.logoutButton]}
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

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#39345B"
  },
  header: {
    fontFamily: 'FunnelSansBold',
    color: 'white',
    fontSize: 30,
    marginBottom: 20
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 180,
    marginTop: 30
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
  logoutButton: {
    marginTop: 150,
    borderTopWidth: 1,
    borderColor: '#5A4D88'
  }
});