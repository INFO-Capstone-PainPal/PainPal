import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import HomeScreen from "./screens/HomeScreen";
import CalendarScreen from "./screens/CalendarScreen";
import LoggingScreen from "./screens/LoggingScreen";
import ChartsScreen from "./screens/ChartsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import QuickLogScreen from "./screens/QuickLogScreen";
import MultiSelectScreen from "./screens/MultiSelectScreen";
import PainMapScreen from "./screens/PainMapScreen";
import { AppSettingsScreen, ProfileSettingsScreen } from "./screens/SettingsScreen";
import ExportScreen from "./screens/ExportScreen";

import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHouse, faCalendarDays, faChartColumn, faCircleUser, faPlus } from "@fortawesome/free-solid-svg-icons";

import { TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function NavBar() {
  const ProfileStackNav = createStackNavigator();

  function ProfileStack() {
    return (
      <ProfileStackNav.Navigator screenOptions={{ headerShown: false }}>
        <ProfileStackNav.Screen name="ProfileHome" component={ProfileScreen} />
        <ProfileStackNav.Screen name="AppSettings" component={AppSettingsScreen} />
        <ProfileStackNav.Screen name="ProfileSettings" component={ProfileSettingsScreen} />
        <ProfileStackNav.Screen name="Export" component={ExportScreen} />
      </ProfileStackNav.Navigator>
    );
  }
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let icon;
          if (route.name === "Home") {
            icon = faHouse;
          } else if (route.name === "Calendar") {
            icon = faCalendarDays;
          } else if (route.name === "QuickLog") {
            icon = faSquarePlus;
          } else if (route.name === "Charts") {
            icon = faChartColumn;
          } else if (route.name === "Profile") {
            icon = faCircleUser;
          }
          return <FontAwesomeIcon icon={icon} size={size * 1.5} color={color} />;
        },
        tabBarShowLabel: false,
        tabBarInactiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: "#39345B",
          borderTopColor: "#827BB9",
          height: 80,
          paddingTop: 15,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="QuickLog" component={QuickLogScreen} options={{
          tabBarButton: (props) => 
          (<TouchableOpacity style={styles.customButtonContainer} onPress={props.onPress}>
            <LinearGradient colors={['#675FA6', '#86B6FF']} style={styles.gradientCircle}>
              <FontAwesomeIcon icon={faPlus} size={36} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        ), tabBarIcon: () => null}}
      />
      <Tab.Screen name="Charts" component={ChartsScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Logging" component={LoggingScreen} />
        <Stack.Screen name="Calendar" component={CalendarScreen} />
        <Stack.Screen name="QuickLog" component={QuickLogScreen} />
        <Stack.Screen name="MultiSelect" component={MultiSelectScreen} />
        <Stack.Screen name="PainMap" component={PainMapScreen} />
        <Stack.Screen name="Main" component={NavBar} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  customButtonContainer: {
    top: -25,
    justifyContent: "center"
  },
  gradientCircle: {
    width: 80,
    height: 80,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center"
  },
});