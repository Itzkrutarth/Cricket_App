import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileSection: {
    padding: 10,
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "#111827",
  },
  role: {
    fontSize: 16,
    textAlign: "center",
    color: "#6B7280",
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  infoItem: {
    marginBottom: 15,
  },
  label: {
    color: "#6B7280",
    fontWeight: "600",
    marginBottom: 3,
  },
  value: {
    fontSize: 16,
    color: "#111827",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2FE",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 8,
  },
  socialText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#111",
    fontWeight: "500",
  },
});
