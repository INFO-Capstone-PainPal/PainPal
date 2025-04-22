import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import QuickLogScreen from "./screens/QuickLogScreen";
import LoggingScreen from "./screens/LoggingScreen";
import CalendarScreen from "./screens/CalendarScreen";
import MultiSelectScreen from "./screens/MultiSelectScreen";

const Stack = createStackNavigator();

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
