import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileSection: {
    padding: 10,
    marginHorizontal: 16, // equal space left and right
    marginVertical: 10, // equal space top and bottom
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    alignSelf: "center", // centers item inside FlatList/Grid
 
  },
  title: {
    marginTop:60,
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
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
    color: "#111827",
  },
  role: {
    fontSize: 16,
    color: "#6B7280",
  },
  infoSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  backIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
});
