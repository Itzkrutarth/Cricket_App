import { StyleSheet, Dimensions } from "react-native"

const { width } = Dimensions.get("window")
const SHOT_SIZE = (width - 60) / 2

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	scrollContent: {
		padding: 16,
	},

	// Card wrapper
	card: {
		backgroundColor: "#fff",
		borderRadius: 12,
		padding: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowRadius: 4,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2,
	},

	// Profile Image + Name
	profileImage: {
		width: 110,
		height: 110,
		borderRadius: 55,
		alignSelf: "center",
		marginBottom: 10,
	},
	name: {
		fontSize: 20,
		fontWeight: "700",
		color: "#111",
		textAlign: "center",
	},

	// Info section
	role: {
		fontSize: 14,
		fontWeight: "600",
		color: "#2563EB",
		textAlign: "center",
		marginBottom: 4,
	},
	experience: {
		fontSize: 14,
		color: "#555",
		textAlign: "center",
		marginBottom: 8,
	},
	contact: {
		fontSize: 14,
		color: "#444",
		textAlign: "center",
		marginBottom: 2,
	},

	// Section title
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1D4ED8",
		marginBottom: 10,
	},

	// Performance metrics
	performanceMetrics: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 8,
	},
	metricItem: {
		alignItems: "center",
	},
	metricLabel: {
		fontSize: 13,
		color: "#888",
		marginBottom: 4,
	},
	metricValue: {
		fontSize: 16,
		fontWeight: "700",
		color: "#111",
	},

	// Recent Videos
	videoGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	videoThumbnail: {
		width: SHOT_SIZE,
		aspectRatio: 1,
		borderRadius: 10,
		backgroundColor: "#eee",
	},
	videoTitle: {
		textAlign: "center",
		marginTop: 4,
		fontWeight: "500",
		fontSize: 13,
		color: "#333",
	},

	// Actions
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
		fontWeight: "600",
		marginLeft: 6,
	},

	// Record Video Button
	recordButton: {
		marginTop: 20,
		paddingVertical: 14,
		backgroundColor: "#2563EB",
		borderRadius: 8,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	recordButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
		marginLeft: 8,
	},
	// Subtitle under name
	subTitle: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
		marginBottom: 16,
	},

	// Shots Container
	shotsContainer: {
		marginBottom: 16,
	},

	// Each row of sample shots
	shotRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 12,
	},

	// Individual image style
	shotImage: {
		width: SHOT_SIZE,
		height: SHOT_SIZE,
		borderRadius: 8,
		backgroundColor: "#e0e0e0",
	},
})
