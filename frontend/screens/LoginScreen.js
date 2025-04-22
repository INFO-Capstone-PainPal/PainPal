import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useFonts } from "expo-font";
import AsyncStorage from "@react-native-async-storage/async-storage";
import tw from "tailwind-react-native-classnames";

const BASE_URL = "http://localhost:8000";

// For Android emulator, use this instead:
// const BASE_URL = "http://10.0.2.2:8000";

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [fontsLoaded] = useFonts({
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
    FunnelSans: require('../assets/fonts/FunnelSans.ttf')
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    setError("");
    try {
      // build multipart form
      const form = new FormData();
      form.append("username", username);
      form.append("password", password);

      const res = await fetch(`${BASE_URL}/token`, {
        method: "POST",
        body: form,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Incorrect username or password");
      }

      await AsyncStorage.setItem("access_token", data.access_token);

      navigation.navigate("Main");
    } catch (e) {
      console.error("Login error", e);
      setError(e.message);
    }
  };

  return (
    <View style={[styles.container, tw`flex-1 justify-center px-6`]}>
      <View style={tw`items-center mb-6`}>
        <Image source={require("../assets/PainPal_Logo.png")} style={styles.logo}/>
      </View>
      <Text style={[tw`text-white text-4xl text-center pt-6 mb-6`, styles.pacifico]}>
        PainPal
      </Text>

      {!!error && (
        <Text style={tw`text-red-400 text-center mb-4`}>
          {error}
        </Text>
      )}
 
      <TextInput
        style={[styles.input, tw`h-12 mb-6`]}
        placeholder="Username"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={[styles.input, tw`h-12 mb-2`]}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity onPress={() => {}} style={tw`mb-6`}>
        <Text style={tw`text-white text-right`}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={tw`text-white text-center font-bold text-lg`}>Log in</Text>
      </TouchableOpacity>

      <View style={tw`mt-6 flex-row justify-center`}>
        <Text style={tw`text-white`}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={tw`text-white font-bold`}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39345B",
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  pacifico: {
    fontFamily: "Pacifico",
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
  },
});
