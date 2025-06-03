import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    marginRight: 12,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E5E7EB",
  },
  greetingContainer: {
    justifyContent: "center",
  },
  greetingText: {
    fontSize: 16,
    color: "#000",
  },

  // Stats Grid
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  statBox: {
    width: "48%",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  statLabel: {
    fontSize: 13,
    color: "#fff",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 4,
  },
  blueBox: {
    backgroundColor: "#1D4ED8",
  },
  purpleBox: {
    backgroundColor: "#7C3AED",
  },
  greenBox: {
    backgroundColor: "#059669",
  },
  orangeBox: {
    backgroundColor: "#EA580C",
  },

  // Student Join Requests
  requestsContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    color: "#1D3557",
  },
  requestCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    marginVertical: 4,
    elevation: 1,
  },
  requestImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D3557",
  },
  requestRole: {
    fontSize: 12,
    color: "#666",
  },
  requestCareer: {
    fontSize: 11,
    color: "#999",
  },
  emptyText: {
    fontSize: 13,
    color: "#666",
  },

  // Events
  eventsContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 30,
  },
  eventCard: {
    backgroundColor: "#E0E7FF",
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D3557",
  },
  eventDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D3557",
  },
  modalImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 8,
  },
  modalRole: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D3557",
    marginTop: 4,
  },
  modalCareer: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginVertical: 6,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    width: "100%",
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButton: {
    backgroundColor: "#1D3557",
  },
  rejectButton: {
    backgroundColor: "#dc3545",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
