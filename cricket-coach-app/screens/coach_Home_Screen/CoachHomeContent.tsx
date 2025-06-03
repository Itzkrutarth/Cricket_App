import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "../../styles/CoachHomeStyles";

type JoinRequest = {
  id: string;
  name: string;
  profileUrl: string;
  role: string;
  careerInfo: string;
};

const dummyRequests: JoinRequest[] = [
  {
    id: "1",
    name: "Rohit Sharma",
    profileUrl: "https://picsum.photos/300/300?1",
    role: "Batsman",
    careerInfo: "Top order batsman with excellent footwork and a great strike rate.",
  },
  {
    id: "2",
    name: "Shikhar Dhawan",
    profileUrl: "https://picsum.photos/300/300?2",
    role: "Opener",
    careerInfo: "Left-handed opener known for aggressive starts and calm approach.",
  },
];

const dummyEvents = [
  { id: "1", title: "Academy League Finals", date: "10 June at 4pm" },
  { id: "2", title: "Workshop on Spin Bowling", date: "15 June at 10am" },
];

const HomeContent = () => {
  const params = useLocalSearchParams();
  const [studentCount, setStudentCount] = useState(3);
  const [coachName, setCoachName] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<JoinRequest | null>(null);

  useEffect(() => {
    if (params.studentCount) {
      setStudentCount(Number(params.studentCount));
    }
  }, [params.studentCount]);

  useEffect(() => {
    const loadCoachData = async () => {
      const name = await AsyncStorage.getItem("userName");
      const photo = await AsyncStorage.getItem("profilePictureUrl");
      if (name) setCoachName(name);
      if (photo) setProfileUrl(photo);
    };
    loadCoachData();
  }, []);

  // Navigate to My Students
  function handleMyStudents(): void {
    router.push({
      pathname: "/coach-home/StudentScreen",
      params: { viewMode: "my" },
    });
  }

  // Navigate to Total Students
  function handleTotalStudents(): void {
    router.push({
      pathname: "/coach-home/StudentScreen",
      params: { viewMode: "all" },
    });
  }

  function handleAcceptRequest(id: string): void {
    console.log(`Accepted request from student ${id}`);
    setSelectedRequest(null);
  }

  function handleRejectRequest(id: string): void {
    console.log(`Rejected request from student ${id}`);
    setSelectedRequest(null);
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profile}>
          <Image
            source={
              profileUrl
                ? { uri: profileUrl }
                : require("../../assets/images/boy.png")
            }
            style={styles.profileImage}
          />
          <View style={styles.greetingContainer}>
            <Text style={styles.greetingText}>
              Hello, {coachName || "Coach"}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <TouchableOpacity
          style={[styles.statBox, styles.blueBox]}
          onPress={handleMyStudents}
        >
          <Feather name="users" size={20} color="#fff" />
          <Text style={styles.statLabel}>My Students</Text>
          <Text style={styles.statValue}>{studentCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.statBox, styles.purpleBox]}
          onPress={handleTotalStudents}
        >
          <Feather name="users" size={20} color="#fff" />
          <Text style={styles.statLabel}>Total Students</Text>
          <Text style={styles.statValue}>45</Text>
        </TouchableOpacity>
        <View style={[styles.statBox, styles.greenBox]}>
          <Feather name="calendar" size={20} color="#fff" />
          <Text style={styles.statLabel}>Sessions</Text>
          <Text style={styles.statValue}>12</Text>
        </View>
        <View style={[styles.statBox, styles.orangeBox]}>
          <Feather name="video" size={20} color="#fff" />
          <Text style={styles.statLabel}>Videos</Text>
          <Text style={styles.statValue}>48</Text>
        </View>
      </View>

      {/* Student Join Requests */}
      <View style={styles.requestsContainer}>
        <Text style={styles.sectionTitle}>Student Join Requests</Text>
        {dummyRequests.length === 0 ? (
          <Text style={styles.emptyText}>No join requests.</Text>
        ) : (
          dummyRequests.map(req => (
            <View key={req.id} style={styles.requestCard}>
              <TouchableOpacity onPress={() => setSelectedRequest(req)}>
                <Image
                  source={{ uri: req.profileUrl }}
                  style={styles.requestImage}
                />
              </TouchableOpacity>
              <View style={styles.requestInfo}>
                <Text style={styles.requestName}>{req.name}</Text>
                <Text style={styles.requestRole}>{req.role}</Text>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Upcoming Events */}
      <View style={styles.eventsContainer}>
        <Text style={styles.sectionTitle}>Upcoming Academy Events</Text>
        {dummyEvents.map(event => (
          <View key={event.id} style={styles.eventCard}>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDate}>{event.date}</Text>
          </View>
        ))}
      </View>

      {/* Modal for Join Request */}
      <Modal visible={!!selectedRequest} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedRequest?.name}</Text>
              <TouchableOpacity onPress={() => setSelectedRequest(null)}>
                <Feather name="x" size={20} color="#666" />
              </TouchableOpacity>
            </View>
            {selectedRequest && (
              <>
                <Image
                  source={{ uri: selectedRequest.profileUrl }}
                  style={styles.modalImage}
                />
                <Text style={styles.modalRole}>{selectedRequest.role}</Text>
                <Text style={styles.modalCareer}>{selectedRequest.careerInfo}</Text>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.acceptButton]}
                    onPress={() => handleAcceptRequest(selectedRequest.id)}
                  >
                    <Text style={styles.actionButtonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={() => handleRejectRequest(selectedRequest.id)}
                  >
                    <Text style={styles.actionButtonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default HomeContent;
