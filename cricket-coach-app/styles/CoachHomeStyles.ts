import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: "#f8f9fc",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Header styles
  header: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  profile: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  greetingContainer: {
    marginLeft: 12,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  subGreeting: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  notificationButton: {
    padding: 8,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#e74a3b",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },

  // Stats grid styles
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  statBox: {
    width: "48%",
    margin: "1%",
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  blueBox: {
    backgroundColor: "#4e73df",
  },
  purpleBox: {
    backgroundColor: "#6f42c1",
  },
  greenBox: {
    backgroundColor: "#1cc88a",
  },
  orangeBox: {
    backgroundColor: "#f6c23e",
  },
  statLabel: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
  },
  statValue: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 4,
  },

  // Section headers
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  viewAllText: {
    color: "#4e73df",
    fontSize: 14,
  },

  // Join requests styles
  requestsContainer: {
    marginTop: 8,
  },
  requestsBadge: {
    backgroundColor: "#e74a3b",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  requestsBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  requestCard: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requestImage: {
    width: "100%",
    height: 120,
    borderRadius: 4,
    marginBottom: 8,
  },
  requestInfo: {
    marginBottom: 8,
  },
  requestName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  requestRole: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  requestActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickAcceptButton: {
    backgroundColor: "#1cc88a",
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  quickRejectButton: {
    backgroundColor: "#e74a3b",
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginLeft: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  // Empty state styles
  emptyState: {
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginTop: 12,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    marginTop: 4,
  },

  // Events styles
  eventsContainer: {
    marginTop: 16,
  },
  eventCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventTypeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  eventDate: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },

  // Videos styles

  videoCoach: {
    marginTop: 16,
    marginBottom: 32,
    width: 180,
    marginLeft: 16,
  },

  videosContainer: {
    marginTop: 16,
    marginBottom: 32,
  },
  videoCard: {
    width: 180,
    marginLeft: 16,
  },
  videoThumbnail: {
    width: "100%",
    height: 100,
    borderRadius: 8,
  },
  videoDuration: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  videoDurationText: {
    color: "#fff",
    fontSize: 12,
  },
  videoTitle: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
  },
  videoCategory: {
    fontSize: 12,
    color: "#4e73df",
    marginTop: 4,
    fontWeight: "600",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "90%",
    maxHeight: "85%",
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  modalImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  modalRole: {
    fontSize: 16,
    color: "#4e73df",
    fontWeight: "600",
    marginBottom: 8,
  },
  modalCareer: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  performanceContainer: {
    marginBottom: 16,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  performanceMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricItem: {
    alignItems: "center",
    backgroundColor: "#f8f9fc",
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: "#666",
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 4,
  },
  modalActions: {
    flexDirection: "row",
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  acceptButton: {
    backgroundColor: "#1cc88a",
  },
  rejectButton: {
    backgroundColor: "#e74a3b",
  },
  actionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Add these to your CoachHomeStyles.ts
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    fontWeight: "500",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  typeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 5,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTypeButton: {
    borderWidth: 2,
    borderColor: "#fff",
  },
  typeButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: "#e74a3b",
  },
  saveButton: {
    backgroundColor: "#4e73df",
  },
  eventForm: {
    padding: 15,
    // flex: 1,
  },
  taskItem: {
    backgroundColor: "#f1f5f9",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4e73df",
  },
  taskItemCompleted: {
    backgroundColor: "#e2e8f0",
    padding: 12,
    marginVertical: 6,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  taskText: {
    fontSize: 16,
    color: "#333",
  },
});
