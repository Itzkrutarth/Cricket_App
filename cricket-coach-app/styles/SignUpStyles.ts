import { Dimensions, StyleSheet } from "react-native"
const { width } = Dimensions.get("window")

export const styles = StyleSheet.create({
	container: {
		flexGrow: 1,
		backgroundColor: "#ffffff",
		padding: 20,
	},
	header: {
		fontSize: 28,
		fontWeight: "bold",
		color: "#111827",
		textAlign: "center",
		marginBottom: 8,
	},
	subheader: {
		textAlign: "center",
		fontSize: 16,
		color: "#6B7280",
		marginBottom: 20,
	},
	date: {
		marginLeft: -20,
		marginBottom: 20,
	},
	input: {
		backgroundColor: "#f9f9f9",
		padding: 12,
		borderRadius: 10,
		color: "#000",
		marginBottom: 15,
	},
	button: {
		backgroundColor: "#2563EB",
		paddingVertical: 15,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 10,
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
	footerText: {
		marginTop: 20,
		fontSize: 14,
		textAlign: "center",
		color: "#6B7280",
	},
	linkText: {
		color: "#1D4ED8",

		fontWeight: "bold",
	},
	error: {
		color: "red",
		textAlign: "center",
		marginBottom: 10,
	},
	radioContainer: {
		flexDirection: "column",
		justifyContent: "space-between",
		marginVertical: 15,
	},
	radioButton: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
	},
	radioCircle: {
		height: 20,
		width: 20,
		borderRadius: 10,
		borderWidth: 2,
		borderColor: "#1D4ED8",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 6,
	},
	radioDot: {
		height: 10,
		width: 10,
		borderRadius: 5,
		backgroundColor: "#1D4ED8",
	},

	profilePicContainer: {
		alignItems: "center",
		marginBottom: 20,
	},
	askuserrole: {
		marginBottom: 10,
		fontWeight: "bold",
	},
	headerContainer: {
		backgroundColor: "#f2f2f2",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 10,
		borderBottomWidth: 1,
		paddingVertical: 8,
		borderBottomColor: "#ccc",
	},

	headerTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#2563EB",
		textAlign: "center",
		flex: 1,
	},

	profilePicWrapper: {
		alignItems: "center",
		marginBottom: 20,
		position: "relative",
	},
	profilePic: {
		width: 120,
		height: 120,
		borderRadius: 60,
	},

	cameraIcon: {
		position: "absolute",
		bottom: 0,
		color: "#2563EB",
		right: "38%",
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 5,
	},
})
