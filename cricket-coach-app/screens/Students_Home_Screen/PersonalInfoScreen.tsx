import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View, TouchableOpacity, Linking } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "../../styles/PersonalInfoStyles";
import Header from "./Header_1";

const PersonalInfoScreen = () => {
  const [name, setName] = useState("Student");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [role, setRole] = useState("Student");

  useEffect(() => {
    const loadUserData = async () => {
      const storedName = await AsyncStorage.getItem("@userName");
      const storedProfile = await AsyncStorage.getItem("@profilePicture");
      const storedRole = await AsyncStorage.getItem("userRole");

      if (storedName) setName(storedName);
      if (storedProfile) setProfilePictureUrl(storedProfile);
      if (storedRole) setRole(storedRole);
    };
    loadUserData();
  }, []);

  return (
    <View style={styles.container}>
      <Header title="Personal Information" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image
            source={
              profilePictureUrl
                ? { uri: profilePictureUrl }
                : require("../../assets/images/boy.png")
            }
            style={styles.profileImage}
          />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Full Name:</Text>
            <Text style={styles.value}>{name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value}>{role}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Birthplace:</Text>
            <Text style={styles.value}>Ahmedabad, India</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>Experience:</Text>
            <Text style={styles.value}>3 Years</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.label}>History:</Text>
            <Text style={styles.value}>
              Talented youth player with district-level achievements and consistent performance in batting and fielding.
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.label}>Biography:</Text>
            <Text style={styles.value}>
              An aspiring cricketer with a passion for learning and improving under the guidance of experienced coaches. Dedicated to becoming a professional player.
            </Text>
          </View>

          <View style={styles.socialContainer}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL("https://www.linkedin.com")}
            >
              <Feather name="linkedin" size={16} color="#0A66C2" />
              <Text style={styles.socialText}>LinkedIn</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => Linking.openURL("https://www.instagram.com")}
            >
              <Feather name="instagram" size={16} color="#E1306C" />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default PersonalInfoScreen;
