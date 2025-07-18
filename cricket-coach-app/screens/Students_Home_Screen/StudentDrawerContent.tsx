import { styles } from "@/styles/StudentDrawerStyles";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { router, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";

const StudentDrawerContent: React.FC<DrawerContentComponentProps> = ({
  navigation,
}) => {
  const [userName, setUserName] = useState("user");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const segments = useSegments();

  // ✅ Load user data once, not on every focus
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const name = await AsyncStorage.getItem("@userName");
        const photo = await AsyncStorage.getItem("@profilePicture");
        const storedRole = await AsyncStorage.getItem("@role");

        console.log("📦 Drawer loaded once:", { name, photo, storedRole });

        setUserName(name || "user");
        setProfilePictureUrl(photo || "");
        setRole(storedRole || "");
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setUserName("user");
    setProfilePictureUrl("");
    setRole("");
    setLoading(true);
    router.replace("/signin");
  };

  const isCurrentRoute = (path: string) =>
    segments.join("/").toLowerCase() === path.toLowerCase();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#1D4ED8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image
          source={
            profilePictureUrl
              ? { uri: profilePictureUrl }
              : require("../../assets/images/boy.png")
          }
          style={styles.profileImage}
        />
        <Text style={styles.coachName}>{userName}</Text>
        <TouchableOpacity>
          <View style={styles.editImageContainer}>
            <Feather name="edit" size={16} color="#1D4ED8" />
            <Text style={styles.editImageText}>Edit Image</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          onPress={() => {
            if (!isCurrentRoute("studenthome")) {
              router.push("/studenthome");
            }
          }}
          style={styles.menuItem}
        >
          <Feather name="home" size={20} color="#1D4ED8" />
          <Text style={styles.menuText}>Home</Text>
        </TouchableOpacity>

        {role === "Player" && (
          <>
            <TouchableOpacity
              onPress={() => {
                if (!isCurrentRoute("student-home/personalinfo_screen")) {
                  router.push("/student-home/personalinfo_screen");
                }
              }}
              style={styles.menuItem}
            >
              <Feather name="user" size={20} color="#1D4ED8" />
              <Text style={styles.menuText}>Personal Information</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!isCurrentRoute("student-home/CoachesScreen")) {
                  router.push("/student-home/CoachesScreen");
                }
              }}
              style={styles.menuItem}
            >
              <Feather name="users" size={20} color="#1D4ED8" />
              <Text style={styles.menuText}>Coaches</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!isCurrentRoute("student-home/AllVideosScreen")) {
                  router.push("/student-home/AllVideosScreen");
                }
              }}
              style={styles.menuItem}
            >
              <Feather name="video" size={20} color="#1D4ED8" />
              <Text style={styles.menuText}>All Videos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!isCurrentRoute("student-home/AllPicturesScreen")) {
                  router.push("/student-home/AllPicturesScreen");
                }
              }}
              style={styles.menuItem}
            >
              <Feather name="image" size={20} color="#1D4ED8" />
              <Text style={styles.menuText}>All Pictures</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!isCurrentRoute("student-home/DrillsScreen")) {
                  router.push("/student-home/DrillsScreen");
                }
              }}
              style={styles.menuItem}
            >
              <Feather name="heart" size={20} color="#1D4ED8" />
              <Text style={styles.menuText}>Drills</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!isCurrentRoute("student-home/SettingsScreen")) {
                  router.push("/student-home/SettingsScreen");
                }
              }}
              style={styles.menuItem}
            >
              <Feather name="settings" size={20} color="#1D4ED8" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={handleLogout} style={styles.logoutItem}>
          <MaterialIcons name="logout" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default StudentDrawerContent;
