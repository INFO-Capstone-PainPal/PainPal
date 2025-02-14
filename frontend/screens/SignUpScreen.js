import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames"; 

const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = () => {
    
  };

  return (
    <View style={tw`flex-1 justify-center px-4`}>
      <Text style={[tw`text-3xl font-bold text-center mb-6`, styles.title]}>
        Create an Account
      </Text>

      <TextInput
        style={[tw`h-10 border rounded px-3 mb-4`, styles.input]}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={[tw`h-10 border rounded px-3 mb-4`, styles.input]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[tw`h-10 border rounded px-3 mb-4`, styles.input]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={[tw`h-10 border rounded px-3 mb-6`, styles.input]}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <Button title="Sign Up" onPress={handleSignUp} />
      <View style={tw`mt-4`}>
        <Button title="Back to Login" onPress={() => navigation.navigate("Login")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "black", // Keep color in StyleSheet
  },
  input: {
    borderColor: "gray", // Keep color in StyleSheet
    borderWidth: 1, // Border thickness
  },
});

export default SignUpScreen;
