import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const PROFILE_SIZE = 120;
const SHOT_SIZE = (width - 60) / 2; // 2 images per row with 20px gap

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 20,
  },

  // Profile Section
  profileImage: {
    width: PROFILE_SIZE,
    height: PROFILE_SIZE,
    borderRadius: PROFILE_SIZE / 2,
    alignSelf: "center",
    marginTop: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center",
    marginTop: 12,
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  role: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 2,
  },
  contact: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 2,
  },

  // Section titles
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1D4ED8",
    marginTop: 20,
    marginBottom: 8,
  },

  // Sample Shots Grid
  shotsContainer: {
    marginTop: 12,
  },
  shotRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  shotImage: {
    width: SHOT_SIZE,
    height: SHOT_SIZE,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },

  // Recent Videos Grid
  videoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
  },
  videoThumbnail: {
    width: SHOT_SIZE,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: "#ddd",
    marginBottom: 12,
  },

  // Actions (Saved, Annotated Buttons)
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  savedButton: {
    backgroundColor: "#2563EB", // Blue
  },
  annotatedButton: {
    backgroundColor: "#7C3AED", // Purple
  },
  actionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },

  // Record Video Button
  recordButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2563EB",
    borderRadius: 8,
    marginTop: 20,
    paddingVertical: 14,
    justifyContent: "center",
  },
  recordButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Empty placeholder (if needed for future expansion)
  placeholderGrid: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
  },
  placeholderText: {
    color: "#9CA3AF",
    fontSize: 16,
    textAlign: "center",
  },
  videoTitle: {
  fontSize: 14,
  color: "#333",
  fontWeight: "500",
  marginTop: 4,
  textAlign: "center",
},
});
