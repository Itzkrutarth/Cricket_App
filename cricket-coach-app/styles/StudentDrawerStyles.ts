import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  profileContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  coachName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  editImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  editImageText: {
    fontSize: 14,
    color: "#1D4ED8",
    marginLeft: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#1D4ED8",
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#DC2626",
  },
});
