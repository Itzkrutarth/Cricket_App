import { styles } from "@/styles/StudentDrawerStyles";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const StudentDrawerContent: React.FC<DrawerContentComponentProps> = ({ navigation }) => {
  const [userName, setUserName] = useState("User");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const loadUserData = async () => {
      const name = await AsyncStorage.getItem("userName");
      const photo = await AsyncStorage.getItem("profilePictureUrl");
      const storedRole = await AsyncStorage.getItem("@role");
      if (name) setUserName(name);
      if (photo) setProfilePictureUrl(photo);
      if (storedRole) setRole(storedRole);
    };
    loadUserData();
  }, []);

  const handleNavigate = (screen: string) => {
    console.log("navigate", screen);
    navigation.navigate(screen as never);
  };

  const handleLogout = async () => {
    console.log("Logging out...");
    await AsyncStorage.clear();
    router.replace("/signin");
  };

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

      <TouchableOpacity onPress={() => router.push("/studenthome")} style={styles.menuItem}>
        <Feather name="home" size={20} color="#1D4ED8" />
        <Text style={styles.menuText}>Home</Text>
      </TouchableOpacity>

      {role === "Player" && (
        <>
          <TouchableOpacity onPress={() => router.push("/student-home/personalinfo_screen")} style={styles.menuItem}>
            <Feather name="user" size={20} color="#1D4ED8" />
            <Text style={styles.menuText}>Personal Information</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/student-home/CoachesScreen")} style={styles.menuItem}>
            <Feather name="users" size={20} color="#1D4ED8" />
            <Text style={styles.menuText}>Coaches</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/student-home/AllVideosScreen")} style={styles.menuItem}>
            <Feather name="video" size={20} color="#1D4ED8" />
            <Text style={styles.menuText}>All Videos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/student-home/AllPicturesScreen")} style={styles.menuItem}>
            <Feather name="image" size={20} color="#1D4ED8" />
            <Text style={styles.menuText}>All Pictures</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/student-home/DrillsScreen")} style={styles.menuItem}>
            <Feather name="heart" size={20} color="#1D4ED8" />
            <Text style={styles.menuText}>Drills</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/student-home/SettingsScreen")} style={styles.menuItem}>
            <Feather name="settings" size={20} color="#1D4ED8" />
            <Text style={styles.menuText}>Settings</Text>
          </TouchableOpacity>
        </>
      )}

      {role === "Coach" && (
        <>
          {/* You can add Coach-specific options here if needed */}
        </>
      )}

      <TouchableOpacity onPress={handleLogout} style={styles.logoutItem}>
        <MaterialIcons name="logout" size={20} color="#DC2626" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default StudentDrawerContent;
