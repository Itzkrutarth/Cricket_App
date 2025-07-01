import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  PanResponder,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import Slider from "@react-native-community/slider";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path, Text as SvgText, Circle } from "react-native-svg";
import { styles } from "@/styles/VideoAnnotationEditor";
import { useDispatch } from "react-redux";
import { markTaskCompleted } from "@/store/taskSlice";
import Header from "./Header_1";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
// Type definitions
interface DrawingAnnotation {
  id: number;
  type: "pen" | "marker";
  path: string;
  color: string;
  strokeWidth: number;
  opacity: number;
  frameTimestamp: number; // Associate annotation with specific frame
}

interface TextAnnotation {
  id: number;
  type: "text";
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  frameTimestamp: number; // Associate annotation with specific frame
}

type Annotation = DrawingAnnotation | TextAnnotation;
type ToolType = "pen" | "marker" | "text" | null;

interface VideoFrame {
  id: number;
  timestamp: number;
  thumbnail: string;
  isActive: boolean;
  annotationCount: number; // Track annotations per frame
}

const { width, height } = Dimensions.get("window");

// Color palette for annotations
const ANNOTATION_COLORS = [
  "#FF3030", // Red
  "#FFD700", // Gold
  "#00FF00", // Green
  "#00BFFF", // Deep Sky Blue
  "#FF69B4", // Hot Pink
  "#FF8C00", // Dark Orange
  "#9370DB", // Medium Purple
  "#FFFFFF", // White
  "#000000", // Black
];

const VideoAnnotationScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // State management
  const [selectedTool, setSelectedTool] = useState<ToolType>(null);
  const [selectedColor, setSelectedColor] = useState("#FF3030");
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [currentPath, setCurrentPath] = useState("");
  const [showTextModal, setShowTextModal] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [textAnnotation, setTextAnnotation] = useState("");
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });
  const [hasChanges, setHasChanges] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoStatus, setVideoStatus] = useState({});
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  const [selectedFrameIndex, setSelectedFrameIndex] = useState(0);
  const [isFrameScrolling, setIsFrameScrolling] = useState(false);

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [voiceNotes, setVoiceNotes] = useState<{ [frame: number]: string }>(
    {}
  );
  const [isRecording, setIsRecording] = useState(false);

  const dispatch = useDispatch();
  const { title, videoSource, taskId } = params;
  // Video frames state - Generate frames for smooth scrubbing
  const [videoFrames, setVideoFrames] = useState<VideoFrame[]>(() => {
    const frames = [];
    for (let i = 0; i < 6; i++) {
      // 60 frames for 1-second intervals
      frames.push({
        id: i + 1,
        timestamp: i * 1000, // Every second
        thumbnail: "",
        isActive: i === 0,
        annotationCount: 0,
      });
    }
    return frames;
  });

  const pathRef = useRef("");
  const videoRef = useRef<Video>(null);
  const frameScrollRef = useRef<ScrollView>(null);

  const getVideoSource = () => {
    if (typeof videoSource === "string" && videoSource.startsWith("http")) {
      return { uri: videoSource };
    }
    return require("../../assets/videos/jay.mp4");
  };

  // Get current frame timestamp
  const getCurrentFrameTimestamp = () => {
    return videoFrames[selectedFrameIndex]?.timestamp || 0;
  };

  // Get annotations for current frame
  const getCurrentFrameAnnotations = () => {
    const currentFrameTimestamp = getCurrentFrameTimestamp();
    return annotations.filter(
      (annotation) =>
        Math.abs(annotation.frameTimestamp - currentFrameTimestamp) < 500 // 0.5 second tolerance
    );
  };

  // Update annotation count for frames
  const updateFrameAnnotationCounts = useCallback(() => {
    setVideoFrames((prevFrames) =>
      prevFrames.map((frame) => ({
        ...frame,
        annotationCount: annotations.filter(
          (annotation) =>
            Math.abs(annotation.frameTimestamp - frame.timestamp) < 500
        ).length,
      }))
    );
  }, [annotations]);

  useEffect(() => {
    updateFrameAnnotationCounts();
  }, [annotations, updateFrameAnnotationCounts]);

  // Frame selection handler
  const selectFrame = async (frameIndex: number) => {
    if (frameIndex === selectedFrameIndex) return;

    setSelectedFrameIndex(frameIndex);
    const selectedFrame = videoFrames[frameIndex];

    // Update video position
    if (videoRef.current && selectedFrame) {
      setIsFrameScrolling(true);
      await videoRef.current.setPositionAsync(selectedFrame.timestamp);
      setCurrentTime(selectedFrame.timestamp);

      // Update active frame
      setVideoFrames((prev) =>
        prev.map((frame, index) => ({
          ...frame,
          isActive: index === frameIndex,
        }))
      );

      setTimeout(() => setIsFrameScrolling(false), 100);
    }
  };

  // Auto-scroll to active frame
  const scrollToActiveFrame = (frameIndex: number) => {
    if (frameScrollRef.current) {
      const frameWidth = 76; // Width + margin
      const scrollPosition =
        frameIndex * frameWidth - width / 2 + frameWidth / 2;
      frameScrollRef.current.scrollTo({
        x: Math.max(0, scrollPosition),
        animated: true,
      });
    }
  };

  // Drawing functionality
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () =>
      selectedTool === "pen" || selectedTool === "marker",
    onMoveShouldSetPanResponder: () =>
      selectedTool === "pen" || selectedTool === "marker",

    onPanResponderGrant: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      pathRef.current = `M${locationX},${locationY}`;
      setCurrentPath(pathRef.current);
    },

    onPanResponderMove: (evt) => {
      const { locationX, locationY } = evt.nativeEvent;
      pathRef.current += ` L${locationX},${locationY}`;
      setCurrentPath(pathRef.current);
    },

    onPanResponderRelease: () => {
      if (
        pathRef.current &&
        (selectedTool === "pen" || selectedTool === "marker")
      ) {
        const newAnnotation: DrawingAnnotation = {
          id: Date.now(),
          type: selectedTool,
          path: pathRef.current,
          color: selectedColor,
          strokeWidth: selectedTool === "pen" ? 3 : 8,
          opacity: selectedTool === "pen" ? 1 : 0.7,
          frameTimestamp: getCurrentFrameTimestamp(),
        };
        setAnnotations((prev) => [...prev, newAnnotation]);
        setCurrentPath("");
        pathRef.current = "";
        setHasChanges(true);
      }
    },
  });

  // Text annotation handling
  const handleTextAnnotation = (evt: any) => {
    if (selectedTool === "text") {
      const { locationX, locationY } = evt.nativeEvent;
      setTextPosition({ x: locationX, y: locationY });
      setShowTextModal(true);
    }
  };

  const addTextAnnotation = () => {
    if (textAnnotation.trim()) {
      const newAnnotation: TextAnnotation = {
        id: Date.now(),
        type: "text",
        text: textAnnotation,
        x: textPosition.x,
        y: textPosition.y,
        color: selectedColor,
        fontSize: 18,
        frameTimestamp: getCurrentFrameTimestamp(),
      };
      setAnnotations((prev) => [...prev, newAnnotation]);
      setTextAnnotation("");
      setShowTextModal(false);
      setHasChanges(true);
    }
  };

  // Tool management
  const selectTool = (tool: ToolType) => {
    setSelectedTool(selectedTool === tool ? null : tool);
  };

  const selectColor = (color: string) => {
    setSelectedColor(color);
    setShowColorPicker(false);
  };

  const clearCurrentFrameAnnotations = () => {
    const currentFrameTimestamp = getCurrentFrameTimestamp();
    const currentFrameAnnotations = annotations.filter(
      (annotation) =>
        Math.abs(annotation.frameTimestamp - currentFrameTimestamp) < 500
    );

    if (currentFrameAnnotations.length === 0) {
      Alert.alert("No Annotations", "No annotations found on current frame.");
      return;
    }

    Alert.alert(
      "Clear Frame Annotations",
      `Are you sure you want to clear ${currentFrameAnnotations.length} annotation(s) from this frame?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => {
            setAnnotations((prev) =>
              prev.filter(
                (annotation) =>
                  Math.abs(annotation.frameTimestamp - currentFrameTimestamp) >=
                  500
              )
            );
            setHasChanges(true);
            setSelectedTool(null);
          },
        },
      ]
    );
  };

  const clearAllAnnotations = () => {
    Alert.alert(
      "Clear All Annotations",
      "Are you sure you want to clear all annotations from all frames?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            setAnnotations([]);
            setHasChanges(false);
            setSelectedTool(null);
          },
        },
      ]
    );
  };

  const undoLastAnnotation = () => {
    const currentFrameTimestamp = getCurrentFrameTimestamp();
    const currentFrameAnnotations = annotations.filter(
      (annotation) =>
        Math.abs(annotation.frameTimestamp - currentFrameTimestamp) < 500
    );

    if (currentFrameAnnotations.length > 0) {
      // Remove last annotation from current frame
      const lastAnnotation =
        currentFrameAnnotations[currentFrameAnnotations.length - 1];
      setAnnotations((prev) =>
        prev.filter((annotation) => annotation.id !== lastAnnotation.id)
      );
      setHasChanges(true);
    } else if (annotations.length > 0) {
      // Remove last annotation from any frame
      setAnnotations((prev) => prev.slice(0, -1));
      setHasChanges(annotations.length > 1);
    }
  };

  // Save functionality
  const saveAnnotations = () => {
    Alert.alert(
      "Save Annotations",
      `Save ${annotations.length} annotations across ${
        videoFrames.filter((f) => f.annotationCount > 0).length
      } frames?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: () => {
            // Save logic: include all voiceNotes
            console.log("Saving annotations:", { annotations, voiceNotes });
            setHasChanges(false);
            Alert.alert("Success", "Annotations saved successfully!");
            if (typeof taskId === "string") dispatch(markTaskCompleted(taskId));
            goToResultScreen(); // <-- redirect after save
          },
        },
      ]
    );
  };

  // Video controls
  const toggleVideoPlayback = async () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  // Navigate frames with arrow keys or gestures
  const navigateFrame = (direction: "prev" | "next") => {
    const newIndex =
      direction === "prev"
        ? Math.max(0, selectedFrameIndex - 1)
        : Math.min(videoFrames.length - 1, selectedFrameIndex + 1);

    if (newIndex !== selectedFrameIndex) {
      selectFrame(newIndex);
      scrollToActiveFrame(newIndex);
    }
  };

  // Generate frame thumbnail
  const generateThumbnail = (timestamp: number) => {
    const hue = ((timestamp / 1000) * 30) % 360;
    return `hsl(${hue}, 70%, 60%)`;
  };

  // Format time
  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const exitAnnotationMode = () => {
    if (hasChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved annotations. What would you like to do?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
          {
            text: "Save & Exit",
            onPress: () => {
              saveAnnotations();
              router.back();
            },
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
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
      const frame = getCurrentFrameTimestamp();
      setVoiceNotes((prev) => ({ ...prev, [frame]: uri || "" }));
      setRecording(null);
      setIsRecording(false);
    } catch (err) {
      Alert.alert("Error", "Failed to stop recording.");
    }
  };

  const goToResultScreen = () => {
    router.push({
      pathname: "/coach-home/CoachResultScreen",
      params: {
        sessionTitle: title, // from your params or state
        videoThumbnail: typeof videoSource === "string" ? videoSource : "", // or a generated thumbnail
        textNotes: "", // replace with your text notes variable if you have one
        drills: [], // replace with your drills array if you have one
        voiceNoteUri: voiceNotes[0] || "", // or pass all voiceNotes if needed
      },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}

      <Header
        title={`Annotate: ${title?.toString() || "Video"}`}
        playPauseButton={
          <TouchableOpacity onPress={toggleVideoPlayback}>
            <Ionicons
              name={isVideoPlaying ? "pause" : "play"}
              size={26}
              color="#1D4ED8"
            />
          </TouchableOpacity>
        }
      />

      {/* Video Player with Annotation Overlay */}
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={getVideoSource()}
          style={styles.video}
          resizeMode={ResizeMode.CONTAIN}
          shouldPlay={false}
          isLooping={true}
          onPlaybackStatusUpdate={(status) => {
            setVideoStatus(status);
            if (status.isLoaded) {
              setIsVideoPlaying(status.isPlaying || false);
              if (!isFrameScrolling) {
                const currentTimestamp = status.positionMillis || 0;
                setCurrentTime(currentTimestamp);

                const nearestFrameIndex = Math.round(currentTimestamp / 1000);
                if (
                  nearestFrameIndex !== selectedFrameIndex &&
                  nearestFrameIndex < videoFrames.length
                ) {
                  setSelectedFrameIndex(nearestFrameIndex);
                  setVideoFrames((prev) =>
                    prev.map((frame, index) => ({
                      ...frame,
                      isActive: index === nearestFrameIndex,
                    }))
                  );
                }
              }
              setVideoDuration(status.durationMillis || 0);
            }
          }}
        />

        {/* Saved Annotations Layer */}
        <View style={styles.savedAnnotationsOverlay} pointerEvents="none">
          <Svg style={StyleSheet.absoluteFillObject}>
            {getCurrentFrameAnnotations().map((annotation) =>
              annotation.type === "text" ? (
                <SvgText
                  key={annotation.id}
                  x={annotation.x}
                  y={annotation.y}
                  fill={annotation.color}
                  fontSize={annotation.fontSize}
                  fontWeight="bold"
                  stroke={annotation.color === "#FFFFFF" ? "#000" : "none"}
                  strokeWidth={annotation.color === "#FFFFFF" ? 1 : 0}
                >
                  {annotation.text}
                </SvgText>
              ) : (
                <Path
                  key={annotation.id}
                  d={annotation.path}
                  stroke={annotation.color}
                  strokeWidth={annotation.strokeWidth}
                  strokeOpacity={annotation.opacity}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )
            )}
          </Svg>
        </View>

        {/* Active Drawing Layer */}
        {selectedTool && (
          <View
            style={styles.drawingOverlay}
            {...panResponder.panHandlers}
            onTouchEnd={handleTextAnnotation}
          >
            <Svg style={StyleSheet.absoluteFillObject}>
              {currentPath && (
                <Path
                  d={currentPath}
                  stroke={selectedColor}
                  strokeWidth={selectedTool === "pen" ? 3 : 8}
                  strokeOpacity={selectedTool === "pen" ? 1 : 0.7}
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
            </Svg>
          </View>
        )}

        {/* Frame Navigation Controls */}
        <View style={styles.frameNavigation}>
          <TouchableOpacity
            style={[
              styles.navButton,
              selectedFrameIndex === 0 && styles.disabledNavButton,
            ]}
            onPress={() => navigateFrame("prev")}
            disabled={selectedFrameIndex === 0}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={selectedFrameIndex === 0 ? "#666" : "#FFD700"}
            />
          </TouchableOpacity>

          <View style={styles.frameInfo}>
            <Text style={styles.frameCounter}>
              {selectedFrameIndex + 1} / {videoFrames.length}
            </Text>
            <Text style={styles.frameTime}>
              {formatTime(getCurrentFrameTimestamp())}
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.navButton,
              selectedFrameIndex === videoFrames.length - 1 &&
                styles.disabledNavButton,
            ]}
            onPress={() => navigateFrame("next")}
            disabled={selectedFrameIndex === videoFrames.length - 1}
          >
            <Ionicons
              name="chevron-forward"
              size={24}
              color={
                selectedFrameIndex === videoFrames.length - 1
                  ? "#666"
                  : "#FFD700"
              }
            />
          </TouchableOpacity>
        </View>

        {/* 🎯 NEW: Frame Scrubber Slider */}
        <View style={{ paddingHorizontal: 16, marginVertical: 10 }}>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={videoDuration}
            value={currentTime}
            step={100} // Adjust for precision
            minimumTrackTintColor="#FFD700"
            maximumTrackTintColor="#555"
            thumbTintColor="#FFD700"
            onValueChange={async (value) => {
              setCurrentTime(value);
              if (videoRef.current) {
                await videoRef.current.setPositionAsync(value);
              }

              const nearestFrame = Math.round(value / 1000);
              if (
                nearestFrame !== selectedFrameIndex &&
                nearestFrame < videoFrames.length
              ) {
                setSelectedFrameIndex(nearestFrame);
                setVideoFrames((prev) =>
                  prev.map((frame, idx) => ({
                    ...frame,
                    isActive: idx === nearestFrame,
                  }))
                );
              }
            }}
          />
        </View>
      </View>

      {/* Video Frames Strip - Enhanced for Selection */}
      <View style={styles.framesContainer}>
        <View style={styles.framesHeader}>
          <Text style={styles.framesTitle}>
            Frame {selectedFrameIndex + 1}:{" "}
            {formatTime(getCurrentFrameTimestamp())}
          </Text>
          <View style={styles.framesInfo}>
            <Text style={styles.annotationCount}>
              {getCurrentFrameAnnotations().length} annotations
            </Text>
            <TouchableOpacity style={styles.framesToggle}>
              <Ionicons name="film" size={16} color="#FFD700" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          ref={frameScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.framesScrollView}
          decelerationRate="fast"
          snapToInterval={76}
          snapToAlignment="center"
        >
          {videoFrames.map((frame, index) => {
            const isSelected = index === selectedFrameIndex;
            const hasAnnotations = frame.annotationCount > 0;

            return (
              <TouchableOpacity
                key={frame.id}
                style={[styles.frameItem, isSelected && styles.selectedFrame]}
                onPress={() => {
                  selectFrame(index);
                  scrollToActiveFrame(index);
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.frameThumbnail,
                    isSelected && styles.selectedThumbnail,
                    hasAnnotations && styles.annotatedThumbnail,
                  ]}
                >
                  <View
                    style={[
                      styles.thumbnailPlaceholder,
                      { backgroundColor: generateThumbnail(frame.timestamp) },
                    ]}
                  >
                    <View style={styles.thumbnailOverlay}>
                      <Ionicons
                        name="videocam"
                        size={12}
                        color="rgba(255,255,255,0.8)"
                      />
                    </View>

                    {/* Annotation indicator */}
                    {hasAnnotations && (
                      <View style={styles.annotationIndicator}>
                        <Text style={styles.annotationBadge}>
                          {frame.annotationCount}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Selection indicator */}
                  {isSelected && (
                    <View style={styles.selectionIndicator}>
                      <Ionicons
                        name="checkmark-circle"
                        size={20}
                        color="#FFD700"
                      />
                    </View>
                  )}
                </View>

                <Text
                  style={[
                    styles.frameTimeLabel,
                    isSelected && styles.selectedFrameTime,
                  ]}
                >
                  {formatTime(frame.timestamp)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tool Palette */}
      <View style={styles.toolPalette}>
        <View style={styles.toolsRow}>
          {/* Drawing Tools */}
          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "pen" && styles.selectedTool,
            ]}
            onPress={() => selectTool("pen")}
          >
            <Ionicons
              name="pencil"
              size={24}
              color={selectedTool === "pen" ? "#000" : "#fff"}
            />
            <Text
              style={[
                styles.toolLabel,
                selectedTool === "pen" && styles.selectedToolLabel,
              ]}
            >
              Pen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "marker" && styles.selectedTool,
            ]}
            onPress={() => selectTool("marker")}
          >
            <Ionicons
              name="brush"
              size={24}
              color={selectedTool === "marker" ? "#000" : "#fff"}
            />
            <Text
              style={[
                styles.toolLabel,
                selectedTool === "marker" && styles.selectedToolLabel,
              ]}
            >
              Marker
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.toolButton,
              selectedTool === "text" && styles.selectedTool,
            ]}
            onPress={() => selectTool("text")}
          >
            <Ionicons
              name="text"
              size={24}
              color={selectedTool === "text" ? "#000" : "#fff"}
            />
            <Text
              style={[
                styles.toolLabel,
                selectedTool === "text" && styles.selectedToolLabel,
              ]}
            >
              Text
            </Text>
          </TouchableOpacity>

          {/* Color Picker */}
          <TouchableOpacity
            style={[styles.toolButton, styles.colorButton]}
            onPress={() => setShowColorPicker(true)}
          >
            <View
              style={[styles.colorPreview, { backgroundColor: selectedColor }]}
            />
            <Text style={styles.toolLabel}>Color</Text>
          </TouchableOpacity>
        </View>
 <View style={styles.toolsRow}>
          {/* Recording Tools */}
          <TouchableOpacity
            style={[styles.toolButton, styles.actionButton]}
            onPress={isRecording ? stopRecording : startRecording}
          >
            <Ionicons
              name={isRecording ? "mic-off" : "mic"}
              size={24}
              color={isRecording ? "#FF3030" : "#fff"}
            />
            <Text style={styles.toolLabel}>
              {isRecording ? "Stop" : "Record"}
            </Text>
          </TouchableOpacity>
          {voiceNotes[getCurrentFrameTimestamp()] && (
            <TouchableOpacity
              style={[styles.toolButton, styles.actionButton]}
              onPress={async () => {
                const { sound } = await Audio.Sound.createAsync({
                  uri: voiceNotes[getCurrentFrameTimestamp()],
                });
                await sound.playAsync();
              }}
            >
              <Ionicons name="play" size={24} color="#FFD700" />
              <Text style={styles.toolLabel}>Play Note</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.toolsRow}>
          {/* Action Tools */}
          <TouchableOpacity
            style={[styles.toolButton, styles.actionButton]}
            onPress={undoLastAnnotation}
            disabled={
              getCurrentFrameAnnotations().length === 0 &&
              annotations.length === 0
            }
          >
            <Ionicons
              name="arrow-undo"
              size={24}
              color={
                getCurrentFrameAnnotations().length === 0 &&
                annotations.length === 0
                  ? "#666"
                  : "#fff"
              }
            />
            <Text
              style={[
                styles.toolLabel,
                getCurrentFrameAnnotations().length === 0 &&
                  annotations.length === 0 &&
                  styles.disabledLabel,
              ]}
            >
              Undo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolButton, styles.actionButton]}
            onPress={clearCurrentFrameAnnotations}
            disabled={getCurrentFrameAnnotations().length === 0}
          >
            <Ionicons
              name="trash"
              size={24}
              color={
                getCurrentFrameAnnotations().length === 0 ? "#666" : "#FF6B6B"
              }
            />
            <Text
              style={[
                styles.toolLabel,
                {
                  color:
                    getCurrentFrameAnnotations().length === 0
                      ? "#666"
                      : "#FF6B6B",
                },
              ]}
            >
              Clear Frame
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolButton, styles.actionButton]}
            onPress={saveAnnotations}
            disabled={!hasChanges}
          >
            <Ionicons
              name="save"
              size={24}
              color={!hasChanges ? "#666" : "#4CAF50"}
            />
            <Text
              style={[
                styles.toolLabel,
                { color: !hasChanges ? "#666" : "#4CAF50" },
              ]}
            >
              Save
            </Text>
          </TouchableOpacity>
        </View>

       
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>
          Frame {selectedFrameIndex + 1}: {getCurrentFrameAnnotations().length}{" "}
          annotation{getCurrentFrameAnnotations().length !== 1 ? "s" : ""} •
          Total: {annotations.length}
        </Text>
        {selectedTool && (
          <Text style={styles.statusText}>
            {selectedTool.toUpperCase()} selected • Tap to draw or add text
          </Text>
        )}
        {hasChanges && (
          <View style={styles.unsavedIndicator}>
            <Ionicons name="ellipse" size={8} color="#FF6B6B" />
            <Text style={styles.unsavedText}>Unsaved</Text>
          </View>
        )}
      </View>

      {/* Color Picker Modal */}
      <Modal
        visible={showColorPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <View style={styles.colorModalOverlay}>
          <View style={styles.colorModalContainer}>
            <Text style={styles.colorModalTitle}>Choose Color</Text>
            <View style={styles.colorGrid}>
              {ANNOTATION_COLORS.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color },
                    selectedColor === color && styles.selectedColorOption,
                  ]}
                  onPress={() => selectColor(color)}
                >
                  {selectedColor === color && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={
                        color === "#FFFFFF" || color === "#FFD700"
                          ? "#000"
                          : "#fff"
                      }
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.closeColorPickerButton}
              onPress={() => setShowColorPicker(false)}
            >
              <Text style={styles.closeColorPickerText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Text Input Modal */}
      <Modal
        visible={showTextModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTextModal(false)}
      >
        <View style={styles.textModalOverlay}>
          <View style={styles.textModalContainer}>
            <Text style={styles.textModalTitle}>Add Text Annotation</Text>
            <Text style={styles.frameIndicator}>
              Frame {selectedFrameIndex + 1} •{" "}
              {formatTime(getCurrentFrameTimestamp())}
            </Text>
            <TextInput
              style={styles.textInput}
              value={textAnnotation}
              onChangeText={setTextAnnotation}
              placeholder="Enter your annotation..."
              placeholderTextColor="#999"
              multiline={true}
              maxLength={100}
              autoFocus={true}
            />
            <Text style={styles.characterCount}>
              {textAnnotation.length}/100
            </Text>
            <View style={styles.textModalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowTextModal(false);
                  setTextAnnotation("");
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.addButton]}
                onPress={addTextAnnotation}
                disabled={!textAnnotation.trim()}
              >
                <Text
                  style={[
                    styles.addButtonText,
                    !textAnnotation.trim() && styles.disabledButtonText,
                  ]}
                >
                  Add Text
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
export default VideoAnnotationScreen;
