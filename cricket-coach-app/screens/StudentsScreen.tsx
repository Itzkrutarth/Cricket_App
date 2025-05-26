// screens/StudentsScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Header from './Header_1';
import { styles } from '../styles/StudentsStyles';

type Student = {
  id: string;
  name: string;
  photoUrl: string;
};

const initialStudents: Student[] = [
  { id: '1', name: 'Andy',  photoUrl: 'https://picsum.photos/300/300?1' },
  { id: '2', name: 'Brian', photoUrl: 'https://picsum.photos/300/300?2' },
  { id: '3', name: 'Josh',  photoUrl: 'https://picsum.photos/300/300?3' },
];

export default function StudentsScreen() {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const router = useRouter();

  const addStudent = () => {
    const nextId = (students.length + 1).toString();
    setStudents(curr => [
      ...curr,
      {
        id: nextId,
        name: `New ${nextId}`,
        photoUrl: 'https://picsum.photos/300/300?rand',
      },
    ]);
  };

  const removeStudent = () => {
    setStudents(curr => curr.slice(0, -1));
  };

  const openDetails = (s: Student) => {
    router.push({
      pathname: '/coach-home/student_details',
      params: {
        id: s.id,
        name: s.name,
        photoUrl: s.photoUrl,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Header title="Students" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.grid}>
          {students.map(s => (
            <TouchableOpacity
              key={s.id}
              style={styles.card}
              onPress={() => openDetails(s)}
            >
              <Image source={{ uri: s.photoUrl }} style={styles.image} />
              <Text style={styles.name}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

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
}
