import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		alignItems: "center",
	},
	menu: {
		marginTop: 30,
		fontSize: 28,
		color: "#1D4ED8",
	},
	profile: {
		flexDirection: "row",
		alignItems: "center",
	},
	name: {
		marginTop: 30,
		fontSize: 20,
		marginRight: 10,
		fontWeight: "bold",
		color: "#111827",
	},
	profileImage: {
		marginTop: 30,
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#E5E7EB",
	},
	stats: {
		marginTop: 40,
		paddingHorizontal: 20,
	},
	statBox: {
		backgroundColor: "#E0E7FF",
		padding: 20,
		borderRadius: 12,
		marginBottom: 15,
	},
	statLabel: {
		fontSize: 14,
		color: "#6B7280",
	},
	statValue: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#1D4ED8",
	},
	editImage: {
		fontSize: 14,
		color: "#1D4ED8",
		marginLeft: 5,
	},

	logout: {
		color: "red",
		fontWeight: "bold",
		marginTop: 30,
		marginLeft: 20,
	},
})
