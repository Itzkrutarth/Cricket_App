import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Entypo, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styles } from "../styles/StudentsStyles";
import Header from "./Header_1";
type Student = {
  id: string;
  name: string;
  photoUrl: string;
};

const initialStudents: Student[] = [
  { id: "1", name: "Andy", photoUrl: "https://picsum.photos/200/300" },
  { id: "2", name: "Brian", photoUrl: "https://picsum.photos/200/300" },
  { id: "3", name: "Josh", photoUrl: "https://picsum.photos/200/300" },
];

const StudentsScreen = () => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const router = useRouter();

  const addStudent = () => {
    const newStudent: Student = {
      id: (students.length + 1).toString(),
      name: `New ${students.length + 1}`,
      photoUrl: "https://picsum.photos/200/300",
    };
    setStudents((prev) => [...prev, newStudent]);
  };

  const removeStudent = () => {
    setStudents((prev) => prev.slice(0, -1));
  };

  const renderItem = ({ item }: { item: Student }) => (
    <View style={styles.imageWrapper}>
      <Image
        source={{ uri: item.photoUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.studentName}>{item.name}</Text>
    </View>
  );

  return (
   <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <Header title="Students" />

      {/* Student Grid */}
      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={addStudent} style={styles.button}>
          <Feather name="user-plus" size={20} color="#1D3557" />
          <Text style={styles.buttonText}>Add Student</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={removeStudent} style={styles.button}>
          <Feather name="user-minus" size={20} color="#1D3557" />
          <Text style={styles.buttonText}>Remove Student</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default StudentsScreen;
