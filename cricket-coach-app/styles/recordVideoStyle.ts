import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  cameraPreview: {
    flex: 1,
  },
  recordingIndicator: {
    position: "absolute",
    top: 130, // just below header
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  recordingText: {
    color: "#ff3333",
    fontWeight: "bold",
  },

  controls: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#dc2626",
    justifyContent: "center",
    alignItems: "center",
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF0000",
    marginRight: 8,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FF0000",
    marginLeft: 8,
  },
  remainingText: {
    fontSize: 14,
    color: "#FF6B6B",
    marginLeft: 8,
  },
  recordButtonActive: {
    backgroundColor: "#FF4444",
  },
  recordButtonDisabled: {
    opacity: 0.5,
  },
  stopButton: {
    backgroundColor: "#FF0000",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  stopButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Add these styles to your recordVideoStyle.ts
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
  permissionText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 24,
    color: "#333",
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: "#1D4ED8",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
