import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: "#F9FAFB",
	},
	gridItem: {
		backgroundColor: "#ffffff",
		paddingVertical: 20,
		paddingHorizontal: 10,
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOpacity: 0.05,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 3,
	},
	header: {
		alignItems: "center",
		marginBottom: 30,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginTop: 8,
		color: "#111827",
	},
	item: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#fff",
		padding: 15,
		borderRadius: 10,
		marginBottom: 12,
		shadowColor: "#000",
		shadowOpacity: 0.03,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
	},
	itemText: {
		marginLeft: 12,
		fontSize: 16,
		color: "#111827",
		fontWeight: "500",
	},

	overlay: {
		position: "absolute",
		bottom: 0,
		width: "100%",
		backgroundColor: "rgba(29,78,216, 0.5)", // semi-transparent black
		paddingVertical: 4,
	},

	overlayText: {
		color: "#fff",
		fontSize: 13,
		textAlign: "center",
		fontWeight: "600",
	},
	imageContainer: {
		flex: 1,
		position: "relative",
		width: "100%",
		height: "100%",
	},

	studentImage: {
		width: "100%",
		height: "100%",
	},
})
