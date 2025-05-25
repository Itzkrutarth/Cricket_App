import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const numColumns = 2;
const itemMargin = 20;
const itemWidth = (width - itemMargin * (numColumns + 1)) / numColumns;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  // Header with back and title
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1D3557",
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 20,
    marginBottom: 10,
  },

  // Grid styles
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  imageWrapper: {
    width: itemWidth,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    marginBottom: itemMargin,
  },
  image: {
    width: "100%",
    height: itemWidth,
    borderRadius: 8,
  },
  studentName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },

  // Buttons
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    gap: 12,
  },
  button: {
    backgroundColor: "#E0E7FF",
    borderRadius: 10,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D3557",
  },
});
