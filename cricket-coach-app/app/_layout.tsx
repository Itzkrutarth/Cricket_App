import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, useRouter, usePathname } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { LogBox } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

LogBox.ignoreLogs([
  "Text strings must be rendered within a <Text> component",
]);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem("@token");
      const role = await AsyncStorage.getItem("@role");

      // ✅ Avoid looping by skipping redirect if already at correct screen
      if (token && role) {
        if (
          (role === "Coach" && pathname !== "/coachhome") ||
          (role === "Player" && pathname !== "/studenthome")
        ) {
          console.log("🔍 Role:", role);
          console.log("➡️ Redirecting to:", role === "Coach" ? "/coachhome" : "/studenthome");
          router.replace(role === "Coach" ? "/coachhome" : "/studenthome");
        }
      } else {
        if (pathname !== "/signin") {
          console.log("❌ No token found. Redirecting to /signin");
          router.replace("/signin");
        }
      }

      setAuthChecked(true);
    };

    checkAuth();
  }, []);

  if (!authChecked) return null;

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
