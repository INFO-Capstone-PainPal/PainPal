import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useFonts } from "expo-font";
import tw from "tailwind-react-native-classnames";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fontsLoaded] = useFonts({
    Pacifico: require("../assets/fonts/Pacifico-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = () => {
    
  };

  return (
    <View style={[styles.container, tw`flex-1 justify-center px-6`]}>
      <View style={tw`items-center mb-6`}>
        <Image source={require("../assets/PainPal_Logo.png")} style={styles.logo} />
      </View>
      <Text style={[tw`text-white text-4xl text-center pt-6 mb-6`, styles.pacifico]}>
        PainPal
      </Text>
      <TextInput
        style={[styles.input, tw`h-12 mb-6`]}
        placeholder="Email"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
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

      <TouchableOpacity onPress={() => {/* handle forgot password */}} style={tw`mb-6`}>
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
