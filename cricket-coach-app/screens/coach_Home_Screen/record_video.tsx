import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  PanResponder,
  Dimensions,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Entypo, Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import Header from "./Header_1";
import { styles } from "@/styles/recordVideoStyle";

type Params = { studentId: string };
const STORAGE_BASE_URL =
  "https://becomebetterstorage.blob.core.windows.net/videos";
const SAS_TOKEN =
  "?sp=rcw&st=2025-06-02T16:24:53Z&se=2025-09-02T00:24:53Z&spr=https&sv=2024-11-04&sr=c&sig=oJF5hsw550wrpdKPH%2Bg0saP3FD01e2c5NuNYB14Paj8%3D";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function RecordVideoScreen() {
  const { studentId } = useLocalSearchParams<Params>();
  const router = useRouter();

  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Gesture tracking
  const [initialDistance, setInitialDistance] = useState(0);
  const [initialZoom, setInitialZoom] = useState(0);
  const [showZoomSlider, setShowZoomSlider] = useState(false);
  const zoomSliderTimeout = useRef<NodeJS.Timeout | null>(null);

  const getBlobUploadUrl = (fileName: string) =>
    `${STORAGE_BASE_URL}/${fileName}${SAS_TOKEN}`;

  // Calculate distance between two touch points
  const getDistance = (touches: any[]) => {
    if (touches.length < 2) return 0;
    const [touch1, touch2] = touches;
    const dx = touch1.pageX - touch2.pageX;
    const dy = touch1.pageY - touch2.pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Show zoom slider temporarily
  const showZoomSliderTemporarily = () => {
    setShowZoomSlider(true);
    if (zoomSliderTimeout.current) {
      clearTimeout(zoomSliderTimeout.current);
    }
    zoomSliderTimeout.current = setTimeout(() => {
      setShowZoomSlider(false);
    }, 2000);
  };

  // Pan responder for pinch-to-zoom and drag gestures
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const touches = evt.nativeEvent.touches;
      if (touches.length === 2) {
        // Pinch gesture started
        const distance = getDistance(touches);
        setInitialDistance(distance);
        setInitialZoom(zoom);
        showZoomSliderTemporarily();
      } else if (touches.length === 1) {
        // Single touch - could be for vertical zoom drag
        showZoomSliderTemporarily();
      }
    },
    onPanResponderMove: (evt, gestureState) => {
      const touches = evt.nativeEvent.touches;
      
      if (touches.length === 2 && initialDistance > 0) {
        // Pinch-to-zoom
        const currentDistance = getDistance(touches);
        const distanceRatio = currentDistance / initialDistance;
        const zoomChange = (distanceRatio - 1) * 0.5; // Sensitivity adjustment
        const newZoom = Math.max(0, Math.min(1, initialZoom + zoomChange));
        setZoom(newZoom);
      } else if (touches.length === 1) {
        // Vertical drag to zoom (like iPhone camera)
        const verticalMovement = -gestureState.dy; // Negative because up should zoom in
        const zoomSensitivity = 0.003; // Adjust this for sensitivity
        const zoomChange = verticalMovement * zoomSensitivity;
        const newZoom = Math.max(0, Math.min(1, zoom + zoomChange));
        setZoom(newZoom);
      }
    },
    onPanResponderRelease: () => {
      setInitialDistance(0);
      setInitialZoom(0);
    },
  });

  useEffect(() => {
    return () => {
      stopRecordingTimer();
      if (zoomSliderTimeout.current) {
        clearTimeout(zoomSliderTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    const requestCameraPermission = async () => {
      if (!permission) return;
      if (!permission.granted) {
        const { granted } = await requestPermission();
        if (!granted) {
          Alert.alert(
            "Camera Permission Required",
            "Please enable camera access to record videos.",
            [{ text: "OK" }]
          );
        }
      }
    };

    requestCameraPermission();
  }, [permission, requestPermission]);

  const startRecordingTimer = () => {
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((prev) => {
        const newTime = prev + 1;
        if (newTime >= 5) {
          handleStopRecording();
        }
        return newTime;
      });
    }, 1000);
  };

  const stopRecordingTimer = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleRecord = async () => {
    if (!cameraRef.current || isRecording || !isReady) return;
    if (!permission?.granted) {
      Alert.alert("Error", "Camera permission is required to record videos.");
      return;
    }

    setIsRecording(true);
    startRecordingTimer();

    try {
      let recordingOptions: any = { maxDuration: 5 };
      if (Platform.OS === "ios") {
        recordingOptions = { ...recordingOptions, quality: "720p", mute: false };
      } else {
        recordingOptions = { ...recordingOptions, quality: "medium" };
      }

      const video = await cameraRef.current.recordAsync(recordingOptions);
      if (!video?.uri) throw new Error("Recording failed: video URI missing.");
    } catch (error: any) {
      Alert.alert(
        "Recording Error",
        error.message || "Could not record video. Please try again."
      );
    } finally {
      setIsRecording(false);
      stopRecordingTimer();
    }
  };

  const handleStopRecording = async () => {
    if (!cameraRef.current || !isRecording) return;

    try {
      const finalTime = recordingTime;
      await cameraRef.current.stopRecording();
      Alert.alert(
        "Recording Complete",
        `Video recorded successfully (${formatTime(finalTime)})!`,
        [{ text: "OK" }]
      );
    } catch (error: any) {
      console.error("Stop recording error:", error);
    }
  };

  // Quick zoom presets
  const setZoomLevel = (level: number) => {
    setZoom(level);
    showZoomSliderTemporarily();
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading camera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permissionText}>Camera access is required to record videos</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
          <Text style={styles.permissionButtonText}>Grant Camera Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Record Video" />

      <View style={{ flex: 1, position: 'relative' }}>
        <CameraView
          ref={cameraRef}
          style={styles.cameraPreview}
          facing="back"
          zoom={zoom}
          mode="video"
          onCameraReady={() => {
            console.log("Camera is ready");
            setIsReady(true);
          }}
          onMountError={(error) => {
            console.error("Camera mount error:", error);
            Alert.alert("Camera Error", "Failed to initialize camera: " + error.message);
          }}
        />

        {/* Gesture overlay */}
        <View 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'transparent',
          }}
          {...panResponder.panHandlers}
        />

        {/* Zoom Level Indicator */}
        {(showZoomSlider || zoom > 0) && (
          <View style={{
            position: "absolute",
            top: 50,
            right: 20,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
            minWidth: 60,
            alignItems: 'center',
          }}>
            <Text style={{ 
              color: "white", 
              fontSize: 14, 
              fontWeight: "bold",
              textAlign: "center"
            }}>
              {zoom === 0 ? "1x" : `${(1 + zoom * 4).toFixed(1)}x`}
            </Text>
          </View>
        )}

        {/* Vertical Zoom Slider */}
        {showZoomSlider && (
          <View style={{
            position: "absolute",
            right: 30,
            top: 100,
            bottom: 150,
            width: 4,
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            borderRadius: 2,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
            <View style={{
              position: 'absolute',
              bottom: 0,
              width: 4,
              height: `${zoom * 100}%`,
              backgroundColor: "white",
              borderRadius: 2,
            }} />
            <View style={{
              position: 'absolute',
              bottom: `${zoom * 100}%`,
              width: 12,
              height: 12,
              backgroundColor: "white",
              borderRadius: 6,
              marginBottom: -6,
            }} />
          </View>
        )}

        {/* Recording indicator */}
        {isRecording && (
          <View style={{
            position: "absolute", 
            top: 20, 
            left: 0, 
            right: 0, 
            alignItems: "center"
          }}>
            <View style={{
              backgroundColor: "rgba(255, 0, 0, 0.8)",
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              flexDirection: "row",
              alignItems: "center",
            }}>
              <View style={{
                width: 8, 
                height: 8, 
                backgroundColor: "white",
                borderRadius: 4, 
                marginRight: 8,
              }} />
              <Text style={{
                color: "white", 
                fontSize: 16, 
                fontWeight: "bold",
              }}>
                REC {formatTime(recordingTime)}
              </Text>
            </View>
          </View>
        )}

        {/* Instructions */}
      </View>

      <View style={styles.controls}>
        {/* Quick Zoom Buttons */}
        <View style={{ 
          flexDirection: "row", 
          marginBottom: 20,
          alignItems: "center",
          justifyContent: "center",
        }}>
          <TouchableOpacity 
            onPress={() => setZoomLevel(0)}
            style={[
              quickZoomButtonStyle,
              zoom === 0 && { backgroundColor: "rgba(255, 255, 255, 0.3)" }
            ]}
          >
            <Text style={quickZoomTextStyle}>1x</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setZoomLevel(0.25)}
            style={[
              quickZoomButtonStyle,
              Math.abs(zoom - 0.25) < 0.05 && { backgroundColor: "rgba(255, 255, 255, 0.3)" }
            ]}
          >
            <Text style={quickZoomTextStyle}>2x</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setZoomLevel(0.5)}
            style={[
              quickZoomButtonStyle,
              Math.abs(zoom - 0.5) < 0.05 && { backgroundColor: "rgba(255, 255, 255, 0.3)" }
            ]}
          >
            <Text style={quickZoomTextStyle}>3x</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => setZoomLevel(1)}
            style={[
              quickZoomButtonStyle,
              zoom === 1 && { backgroundColor: "rgba(255, 255, 255, 0.3)" }
            ]}
          >
            <Text style={quickZoomTextStyle}>5x</Text>
          </TouchableOpacity>
        </View>

        {/* Record/Stop Button */}
        <TouchableOpacity
          onPress={isRecording ? handleStopRecording : handleRecord}
          disabled={!isReady}
          style={[
            styles.recordButton,
            isRecording && styles.recordButtonActive,
            !isReady && styles.recordButtonDisabled,
          ]}
        >
          {isRecording ? (
            <Entypo name="controller-stop" size={36} color="#fff" />
          ) : (
            <Entypo name="controller-record" size={36} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const quickZoomButtonStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  paddingHorizontal: 16,
  paddingVertical: 8,
  borderRadius: 20,
  marginHorizontal: 5,
  minWidth: 45,
  alignItems: 'center' as const,
};

const quickZoomTextStyle = {
  color: "black",
  fontSize: 14,
  fontWeight: "bold" as const,
};