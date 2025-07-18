import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Share,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { styles } from "../../styles/CoachResultScreenStyles";
import { router, useLocalSearchParams } from "expo-router";
import Header from "./Header_1";
import { Audio } from "expo-av";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Video, ResizeMode } from "expo-av"; // ✅ Add Video import
import * as FileSystem from "expo-file-system";

// Pre-defined drills
const suggestedDrills = [
  { id: "101", name: "Shadow Batting", icon: "run" },
  { id: "102", name: "Wall Throws", icon: "baseball" },
  { id: "103", name: "Agility Ladder", icon: "ladder" },
];

const exerciseIcons = ["barbell", "run", "dumbbell"] as const;
type ExerciseIcon = (typeof exerciseIcons)[number];

const explainerIcons = [
  "information",
  "lightbulb-on",
  "comment-question",
] as const;
type ExplainerIcon = (typeof explainerIcons)[number];

const CoachAnnotationResultScreen = () => {
  const {
    sessionTitle,
    videoThumbnail,
    videoUri,
    textNotes: initialNotes,
    drills: drillsParam,
    voiceNoteUri: initialVoiceNoteUri,
    videoId,
    studentId,
  } = useLocalSearchParams();

  const coachId = useSelector((state: RootState) => state.user.email);

  // ✅ Add video playback state
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    console.log("📦 Result Screen Params:", {
      sessionTitle,
      videoThumbnail,
      videoUri,
      textNotes: initialNotes,
      drills: drillsParam,
      voiceNoteUri: initialVoiceNoteUri,
      videoId,
      studentId,
      coachId,
    });
  }, []);

  const [textNotes, setTextNotes] = useState(initialNotes || "");
  const [selectedDrillIds, setSelectedDrillIds] = useState<string[]>([]);
  const [exercises, setExercises] = useState<
    { name: string; icon: ExerciseIcon }[]
  >([]);
  const [explainers, setExplainers] = useState<
    { name: string; icon: ExplainerIcon }[]
  >([]);

  // Voice note logic
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceNoteUri, setVoiceNoteUri] = useState(initialVoiceNoteUri || "");

  // ✅ Get video source helper function
  const getVideoSource = () => {
    const videoUrl = videoUri || videoThumbnail;
    if (typeof videoUrl === "string" && videoUrl.startsWith("http")) {
      return { uri: videoUrl };
    }
    // Fallback to default video if no valid URI
    return require("../../assets/videos/jay.mp4");
  };

  // ✅ Toggle video playback
  const toggleVideoPlayback = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission required",
          "Please grant microphone permission."
        );
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      Alert.alert("Error", "Failed to start recording.");
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setVoiceNoteUri(uri || "");
      setRecording(null);
      setIsRecording(false);
      Alert.alert("Voice Note Saved", "Your voice note has been saved.");
    } catch (err) {
      Alert.alert("Error", "Failed to stop recording.");
    }
  };

  const playVoiceNote = async () => {
    if (!voiceNoteUri) {
      Alert.alert("No Voice Note", "No voice note available to play.");
      return;
    }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
        playThroughEarpieceAndroid: false,
      });
      const { sound } = await Audio.Sound.createAsync({ uri: voiceNoteUri });
      await sound.setVolumeAsync(1.0);
      await sound.playAsync();
    } catch (err) {
      Alert.alert("Error", "Failed to play voice note.");
    }
  };

  // Share session result
  const shareResult = async () => {
    try {
      const selectedDrills = suggestedDrills.filter((d) =>
        selectedDrillIds.includes(d.id)
      );
      await Share.share({
        title: `Coaching Session: ${sessionTitle}`,
        message: `Check out my notes and drills from the session "${sessionTitle}".\n\nNotes:\n${textNotes}\n\nDrills:\n${selectedDrills
          .map((d) => `- ${d.name}`)
          .join("\n")}`,
        url: videoThumbnail,
      });
    } catch (error) {
      Alert.alert("Error", "Unable to share session.");
    }
  };

  // Save feedback
  const saveFeedback = async () => {
    try {
      const selectedDrills = suggestedDrills.filter((d) =>
        selectedDrillIds.includes(d.id)
      );

      // Convert local voice note to base64
      const uri =
        typeof voiceNoteUri === "string"
          ? voiceNoteUri
          : Array.isArray(voiceNoteUri) && voiceNoteUri.length > 0
          ? voiceNoteUri[0]
          : "";
      const voiceNoteBase64 = uri
        ? await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          })
        : "";

      const voiceNoteFileName = `${studentId}_${Date.now()}.m4a`;

      await fetch(
        "https://becomebetter-api.azurewebsites.net/api/SaveFeedback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionTitle,
            videoThumbnail,
            videoUri,
            videoId,
            studentId,
            coachId,
            textNotes,
            drills: selectedDrills,
            exercises,
            explainers,
            voiceNoteBase64,
            voiceNoteFileName,
          }),
        }
      );
	  console.log("📝 Feedback Payload:");
		console.log("Student ID:", studentId);
		console.log("Coach ID:", coachId);
		console.log("Video ID:", videoId);
		console.log("Video URI:", videoUri);
		console.log("Video Thumbnail:", videoThumbnail);
		console.log("Session Title:", sessionTitle);
		console.log("Text Notes:", textNotes);
		console.log("Drills:", selectedDrills);
		console.log("Exercises:", exercises);
		console.log("Explainers:", explainers);
		console.log("Voice Note Base64:", voiceNoteBase64?.slice(0, 100) + "..."); // shortened
		console.log("Voice Note File Name:", voiceNoteFileName);

      Alert.alert("Success", "Feedback saved and sent to student!");
	   router.push({
    pathname: "/coachhome", // ✅ Updated to correct screen name
  });
    } catch (err) {
      console.error("❌ Error saving feedback", err);
      Alert.alert("Error", "Failed to save feedback.");
    }
  };

  // Modal state
  const [exerciseModalVisible, setExerciseModalVisible] = useState(false);
  const [explainerModalVisible, setExplainerModalVisible] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState("");
  const [newExerciseIcon, setNewExerciseIcon] =
    useState<ExerciseIcon>("barbell");
  const [newExplainerName, setNewExplainerName] = useState("");
  const [newExplainerIcon, setNewExplainerIcon] =
    useState<ExplainerIcon>("information");

  const addExercise = () => {
    setNewExerciseName("");
    setNewExerciseIcon("barbell");
    setExerciseModalVisible(true);
  };

  const addExplainer = () => {
    setNewExplainerName("");
    setNewExplainerIcon("information");
    setExplainerModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Header title="Annotation Result" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Header with Video Player */}
        <View style={styles.header}>
          {/* ✅ Replace Image with Video component */}
          <View style={styles.videoContainer}>
            <Video
              source={getVideoSource()}
              style={styles.thumbnail}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay={isVideoPlaying}
              isLooping={true}
              useNativeControls={true}
              onPlaybackStatusUpdate={(status) => {
                if (status.isLoaded) {
                  setIsVideoPlaying(status.isPlaying || false);
                }
              }}
            />

            {/* ✅ Optional: Custom play/pause button overlay */}
            {!isVideoPlaying && (
              <TouchableOpacity
                style={styles.playButton}
                onPress={toggleVideoPlayback}
              >
                <Ionicons
                  name="play-circle"
                  size={50}
                  color="rgba(255,255,255,0.8)"
                />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.sessionTitle}>
            {sessionTitle || "Session Title"}
          </Text>
        </View>

        {/* Rest of your existing code remains the same... */}
        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Text Notes</Text>
          <TextInput
            style={styles.textNotesInput}
            value={textNotes}
            onChangeText={setTextNotes}
            placeholder="Add your notes here..."
            multiline
          />
        </View>

        {/* Drills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Drills</Text>
          {suggestedDrills.map((drill) => (
            <TouchableOpacity
              key={drill.id}
              style={[
                styles.drillItem,
                selectedDrillIds.includes(drill.id) && {
                  backgroundColor: "#E0E7FF",
                },
              ]}
              onPress={() => {
                setSelectedDrillIds((prev) =>
                  prev.includes(drill.id)
                    ? prev.filter((id) => id !== drill.id)
                    : [...prev, drill.id]
                );
              }}
            >
              <MaterialCommunityIcons
                name={drill.icon}
                size={24}
                color="#1D4ED8"
              />
              <Text style={styles.drillName}>{drill.name}</Text>
              {selectedDrillIds.includes(drill.id) && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color="#10B981"
                  style={{ marginLeft: 8 }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Exercise */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercise</Text>
          {exercises.map((ex, idx) => (
            <View
              key={idx}
              style={[styles.drillItem, { justifyContent: "space-between" }]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name={ex.icon}
                  size={24}
                  color="#1D4ED8"
                />
                <Text style={styles.drillName}>{ex.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setExercises((prev) => prev.filter((_, i) => i !== idx));
                }}
                style={{ marginLeft: 10, padding: 4 }}
              >
                <Ionicons name="close-circle" size={22} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.drillButtonFullWidth}
            onPress={addExercise}
          >
            <Ionicons name="barbell-outline" size={20} color="#1D4ED8" />
            <Text style={styles.drillButtonText}>Add Exercise</Text>
          </TouchableOpacity>
        </View>

        {/* Explainer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explainer</Text>
          {explainers.map((ex, idx) => (
            <View
              key={idx}
              style={[styles.drillItem, { justifyContent: "space-between" }]}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialCommunityIcons
                  name={ex.icon}
                  size={24}
                  color="#1D4ED8"
                />
                <Text style={styles.drillName}>{ex.name}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setExplainers((prev) => prev.filter((_, i) => i !== idx));
                }}
                style={{ marginLeft: 10, padding: 4 }}
              >
                <Ionicons name="close-circle" size={22} color="#EF4444" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.drillButtonFullWidth}
            onPress={addExplainer}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#1D4ED8"
            />
            <Text style={styles.drillButtonText}>Add Explainer</Text>
          </TouchableOpacity>
        </View>

        {/* Voice Note */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voice Note</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={[
                styles.voiceNoteButton,
                isRecording && { backgroundColor: "#FF3030" },
              ]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Ionicons
                name={isRecording ? "stop" : "mic"}
                size={24}
                color="#fff"
              />
              <Text style={styles.voiceNoteButtonText}>
                {isRecording ? "Stop Recording" : "Record Voice Note"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.voiceNoteButton, { marginRight: 0 }]}
              onPress={playVoiceNote}
              disabled={!voiceNoteUri}
            >
              <Ionicons name="play" size={24} color="#fff" />
              <Text style={styles.voiceNoteButtonText}>Play Voice Note</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.shareButton,
            { backgroundColor: "#1D4ED8", marginTop: 10 },
          ]}
          onPress={saveFeedback}
        >
          <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
          <Text style={styles.shareButtonText}>Save</Text>
        </TouchableOpacity>
        {/* Share Button */}
        <TouchableOpacity style={styles.shareButton} onPress={shareResult}>
          <Ionicons name="share-social-outline" size={24} color="#fff" />
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Exercise Modal */}
      {exerciseModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Exercise</Text>
            <TextInput
              placeholder="Exercise name"
              value={newExerciseName}
              onChangeText={setNewExerciseName}
              style={styles.modalInput}
            />
            <Text style={{ marginBottom: 8 }}>Pick an icon:</Text>
            <View style={styles.iconRow}>
              {exerciseIcons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setNewExerciseIcon(icon)}
                  style={[
                    styles.iconOption,
                    newExerciseIcon === icon && styles.iconOptionSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={icon}
                    size={30}
                    color="#1D4ED8"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setExerciseModalVisible(false)}
                style={styles.modalAction}
              >
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (newExerciseName.trim()) {
                    setExercises((prev) => [
                      ...prev,
                      { name: newExerciseName.trim(), icon: newExerciseIcon },
                    ]);
                    setExerciseModalVisible(false);
                  }
                }}
                style={styles.modalAction}
              >
                <Text style={styles.modalAdd}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Explainer Modal */}
      {explainerModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add Explainer</Text>
            <TextInput
              placeholder="Explainer name"
              value={newExplainerName}
              onChangeText={setNewExplainerName}
              style={styles.modalInput}
            />
            <Text style={{ marginBottom: 8 }}>Pick an icon:</Text>
            <View style={styles.iconRow}>
              {explainerIcons.map((icon) => (
                <TouchableOpacity
                  key={icon}
                  onPress={() => setNewExplainerIcon(icon)}
                  style={[
                    styles.iconOption,
                    newExplainerIcon === icon && styles.iconOptionSelected,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={icon}
                    size={30}
                    color="#1D4ED8"
                  />
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setExplainerModalVisible(false)}
                style={styles.modalAction}
              >
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (newExplainerName.trim()) {
                    setExplainers((prev) => [
                      ...prev,
                      { name: newExplainerName.trim(), icon: newExplainerIcon },
                    ]);
                    setExplainerModalVisible(false);
                  }
                }}
                style={styles.modalAction}
              >
                <Text style={styles.modalAdd}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default CoachAnnotationResultScreen;
