import { router } from "expo-router";
import React from "react";
import { Button, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PlayerHomeScreen() {
  const handleLogout = async () => {
    await AsyncStorage.clear(); // 🧼 Clear JWT and all session keys
    router.replace("/signin");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome Player!</Text>
      <Text>Player dashboard coming soon 🎯</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}
