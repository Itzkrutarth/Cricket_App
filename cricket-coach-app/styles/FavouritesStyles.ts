import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  item: {
    marginTop: 20,
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 10,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    alignSelf: "center",
    // Optional: Add shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  thumbnail: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 8, // Rounded corners for videos
  },
  videoTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    color: "#333",
    paddingHorizontal: 4,
  },
});
