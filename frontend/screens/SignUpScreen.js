import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames";

const BASE_URL = "http://localhost:8000";

// For Android emulator, use this instead:
// const BASE_URL = "http://10.0.2.2:8000";

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: name,
          full_name: name,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Failed to register");
      }

      console.log("User created:", data);
      navigation.goBack()
      } catch (e) {
      setError(e.message);
    }
  };

  return (
    <View style={[styles.container, tw`flex-1 justify-center px-6`]}>
      <Text style={[tw`text-white text-3xl font-bold text-center mb-8`]}>
        Create Account
      </Text>

      <TextInput
        style={[styles.input, tw`h-12 mb-6`]}
        placeholder="Username"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

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
        style={[styles.input, tw`h-12 mb-6`]}
        placeholder="Password"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={[styles.input, tw`h-12 mb-6`]}
        placeholder="Confirm Password"
        placeholderTextColor="#999"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      {!!error && (
        <Text style={tw`text-red-400 mb-4 text-center`}>
          {error}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={tw`text-white text-center font-bold text-lg`}>Sign up</Text>
      </TouchableOpacity>

      <View style={tw`mt-6 flex-row justify-center`}>
        <Text style={tw`text-white`}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={tw`text-white font-bold`}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#39345B",
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
