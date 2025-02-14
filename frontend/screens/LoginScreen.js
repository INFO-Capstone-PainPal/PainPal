import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import tw from "tailwind-react-native-classnames"; 

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

  };

  return (
    <View style={tw`flex-1 justify-center px-4`}>

      <Text style={[tw`text-3xl font-bold text-center mb-6`, styles.title]}>
        PainPal
      </Text>

      <TextInput
        style={[tw`h-10 border rounded px-3 mb-4`, styles.input]}
        placeholder="Email"
        value={email} 
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={[tw`h-10 border rounded px-3 mb-6`, styles.input]}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Button title="Login" onPress={handleLogin} />
      <View style={tw`mt-4`}>
        <Button title="Sign Up" onPress={() => navigation.navigate("SignUp")} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    color: "black", 
  },
  input: {
    borderColor: "gray", 
    borderWidth: 1,
  },
});

export default LoginScreen;
