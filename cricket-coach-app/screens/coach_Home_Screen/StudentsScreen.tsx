import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import Header from "./Header_1";
import { styles } from "../../styles/StudentsStyles";

type Student = {
  id: string;
  name: string;
  photoUrl: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  role?: string;
  experience?: string;
  birthDate?: Date;
  gender?: string;
};

const initialStudents: Student[] = [
  {
    id: "1",
    name: "Andy",
    role: "Batsman",
    photoUrl: "https://picsum.photos/300/300?1",
    email: "andy@academy.com",
    phoneNumber: "+1-555-123-4567",
  },
  {
    id: "2",
    name: "Brian",
    role: "Bowler",
    photoUrl: "https://picsum.photos/300/300?2",
    email: "brian@academy.com",
    phoneNumber: "+1-555-234-5678",
  },
  {
    id: "3",
    name: "Josh",
    role: "All-rounder",
    photoUrl: "https://picsum.photos/300/300?3",
    email: "josh@academy.com",
    phoneNumber: "+1-555-345-6789",
  },
];

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const params = useLocalSearchParams();
  const viewMode = params.viewMode || "my";

  useEffect(() => {
    router.setParams({ studentCount: students.length.toString() });
  }, [students.length]);

  useFocusEffect(
    useCallback(() => {
      // Refresh logic if needed
    }, [])
  );

  const addStudent = () => {
    router.push("/coach-home/add_student");
  };

  const removeStudent = (student: Student) => {
    Alert.alert(
      "Remove Student",
      `Are you sure you want to remove ${student.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setStudents((curr) => curr.filter((s) => s.id !== student.id));
          },
        },
      ]
    );
  };

  const openDetails = (student: Student) => {
    router.push({
      pathname: "/coach-home/student_details",
      params: {
        id: student.id,
        name: student.name,
        photoUrl: student.photoUrl,
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        email: student.email || "",
        phoneNumber: student.phoneNumber || "",
        address: student.address || "",
        role: student.role || "",
        experience: student.experience || "",
        birthDate: student.birthDate?.toISOString() || "",
        gender: student.gender || "",
        viewMode, // Pass the viewMode parameter
      },
    });
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Header title="Students" />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={18} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search students..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* If no matches */}
      {filteredStudents.length === 0 ? (
        <View style={styles.emptyState}>
          <Feather name="users" size={64} color="#ccc" />
          <Text style={styles.emptyStateTitle}>No Matches</Text>
          <Text style={styles.emptyStateText}>No students found.</Text>
          {viewMode === "all" && (
            <TouchableOpacity
              style={[styles.button, styles.addButton, { marginTop: 16 }]}
              onPress={addStudent}
            >
              <Feather name="user-plus" size={20} color="#fff" />
              <Text style={[styles.buttonText, styles.addButtonText]}>
                Add New Student
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {filteredStudents.map((student) => (
            <View key={student.id} style={styles.card}>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                onPress={() => openDetails(student)}
              >
                <Image
                  source={{ uri: student.photoUrl }}
                  style={styles.image}
                />
                <Text style={styles.name}>{student.name}</Text>
              </TouchableOpacity>

              {viewMode === "all" && (
                <TouchableOpacity
                  style={[styles.button, styles.addButton]}
                  onPress={addStudent}
                >
                  <Feather name="user-plus" size={16} color="#fff" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.button, styles.removeButton]}
                onPress={() => removeStudent(student)}
              >
                <Feather name="user-minus" size={16} color="#dc3545" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
