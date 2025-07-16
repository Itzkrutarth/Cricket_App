import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Header from "./Header_1";
import { styles } from "@/styles/StudentsStyles"; // reusing same layout style
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type Coach = {
  id: string;
  username: string;
  name: string;
  photoUrl: string;
  email?: string;
  role?: string;
  students: string[];
  isAssigned?: boolean;
};

export default function CoachesScreen() {
  const [loading, setLoading] = useState(true);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const params = useLocalSearchParams();
  const viewMode = params.viewMode || "my";
  const router = useRouter();
  const studentId = useSelector((state: RootState) => state.user.id)?.trim();
  const ADD_COACH_KEY = process.env.EXPO_PUBLIC_ADD_COACH_KEY;

  const DEFAULT_PROFILE_PIC =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      // 1. Get student record (to fetch assigned coaches)
      const studentRes = await fetch(
        `https://becomebetter-api.azurewebsites.net/api/GetUserById?id=${studentId}`
      );
      const studentText = await studentRes.text();
      if (!studentText || studentText.trim() === "") {
        throw new Error("Empty response from GetUserById API");
      }
      const studentData = JSON.parse(studentText);
      const assignedCoachEmails: string[] =
        studentData.coaches?.map((c: string) => c.trim().toLowerCase()) || [];

      // 2. Get all coaches
      const coachRes = await fetch(
        "https://becomebetter-api.azurewebsites.net/api/GetUsers?role=Coach"
      );
      const coachText = await coachRes.text();
      if (!coachText || coachText.trim() === "") {
        throw new Error("Empty response from GetUsers API");
      }
      const coachesData = JSON.parse(coachText);

      // 3. Format coaches
      const formatted: Coach[] = coachesData.map((user: any) => ({
        id: user.id,
        username: user.username || "unknown",
        name: user.name || "Unnamed Coach",
        email: user.email || "",
        role: user.role || "Coach",
        photoUrl: user.profilePictureUrl || DEFAULT_PROFILE_PIC,
        students: user.students || [],
        isAssigned: assignedCoachEmails.includes(
          (user.email || "").trim().toLowerCase()
        ),
      }));
      console.log(
        "📷 Coach photo URLs:",
        formatted.map((c) => c.photoUrl)
      );
      const filtered =
        viewMode === "my"
          ? formatted.filter((coach) => coach.isAssigned)
          : formatted;

      setCoaches(filtered);

      console.log("🎓 Student coaches:", assignedCoachEmails);
    } catch (err: any) {
      console.error("❌ Failed to load coaches:", err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCoaches(); // refresh on screen focus
    }, [])
  );

  const handleAssignCoach = async (coach: Coach) => {
    setAssigningId(coach.id);
    try {
      if (!studentId || !coach.id) {
        Alert.alert("Error", "Missing student or coach ID.");
        return;
      }
      console.log("➡️ Assigning coach:", {
        studentId,
        coachId: coach.id,
        addCoachKey: process.env.EXPO_PUBLIC_ADD_COACH_KEY,
      });

      const res = await fetch(
        `https://becomebetter-api.azurewebsites.net/api/AddCoachToStudent?code=${ADD_COACH_KEY}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId,
            coachId: coach.id,
          }),
        }
      );

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to add coach.");
      }

      Alert.alert("Success", `${coach.name} has been added to your coaches.`);
      await fetchCoaches();
    } catch (error: any) {
      console.error("❌ AddCoachToStudent error:", error.message);
      Alert.alert("Error", error.message || "Something went wrong.");
    } finally {
      setAssigningId(null);
    }
  };

  const removeCoach = (coach: Coach) => {
    Alert.alert(
      "Remove Coach",
      `Are you sure you want to remove ${coach.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              // First, update student document to remove coach
              const res = await fetch(
                `https://becomebetter-api.azurewebsites.net/api/GetUserById?id=${studentId}`
              );
              const student = await res.json();
              const updatedCoaches = (student.coaches || []).filter(
                (id: string) => id !== coach.id
              );

              await fetch(
                "https://becomebetter-api.azurewebsites.net/api/UpdateUser",
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    id: studentId,
                    coaches: updatedCoaches,
                  }),
                }
              );

              // Then update coach’s students[] array
              await fetch(
                `https://becomebetter-api.azurewebsites.net/api/RemoveStudentFromCoach?code=${process.env.EXPO_PUBLIC_REMOVE_STUDENT_KEY}`,
                {
                  method: "PUT",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ coachId: coach.id, studentId }),
                }
              );

              await fetchCoaches(); // Refresh
              Alert.alert("Removed", `${coach.name} has been removed.`);
            } catch (err) {
              console.error("❌ Failed to remove coach:", err);
              Alert.alert("Error", "Failed to remove coach.");
            }
          },
        },
      ]
    );
  };

  const openDetails = (coach: Coach) => {
    router.push({
      pathname: "/student-home/coach-detail",
      params: {
        id: coach.id,
        name: coach.name,
        username: coach.username,
        photoUrl: coach.photoUrl,
      },
    });
  };

  const filteredCoaches = coaches.filter((coach) =>
    coach.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header title="Coaches" />

      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search coaches..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Loading coaches...
        </Text>
      ) : filteredCoaches.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="users" size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Matches</Text>
          <Text style={styles.emptyStateText}>No coaches found.</Text>
          {/* {viewMode === "all" && (
						<TouchableOpacity
							style={[styles.button, styles.addButton, { marginTop: 16 }]}
							onPress={addCoach}
						>
							<Feather name="user-plus" size={20} color="#fff" />
							<Text style={[styles.buttonText, styles.addButtonText]}>
								Add New Coach
							</Text>
						</TouchableOpacity>
					)} */}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredCoaches.map((coach) => (
            <View key={coach.id} style={styles.card}>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                onPress={() => openDetails(coach)}
              >
                <Image source={{ uri: coach.photoUrl }} style={styles.image} />
                <View style={{ marginLeft: 12 }}>
                  <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                    {coach.name || "Unnamed Coach"}
                  </Text>
                  <Text style={{ color: "#666", fontSize: 13 }}>
                    @{coach.username || "unknown"}
                  </Text>
                </View>
              </TouchableOpacity>

              {viewMode === "all" ? (
                coach.isAssigned ? (
                  <Text style={{ color: "#28a745", fontWeight: "600" }}>
                    ✓ Already Added
                  </Text>
                ) : (
                  <TouchableOpacity
                    style={[styles.button, styles.addButton]}
                    onPress={() => handleAssignCoach(coach)}
                    disabled={assigningId === coach.id}
                  >
                    {assigningId === coach.id ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Feather name="user-plus" size={16} color="#fff" />
                    )}
                  </TouchableOpacity>
                )
              ) : (
                <TouchableOpacity
                  style={[styles.button, styles.removeButton]}
                  onPress={() => removeCoach(coach)}
                >
                  <Feather name="user-minus" size={16} color="#dc3545" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
