import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#F5F5F5",
		padding: 20,
		justifyContent: "center",
	},
	header: {
		fontSize: 24,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 10,
		color: "#111827",
	},
	subheader: {
		fontSize: 14,
		textAlign: "center",
		color: "#6B7280",
		marginBottom: 20,
		paddingHorizontal: 10,
	},
	card: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 15,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 3 },
		shadowRadius: 5,
		marginBottom: 20,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#111827",
	},
	input: {
		backgroundColor: "#F3F4F6",
		padding: 15,
		borderRadius: 10,
		marginBottom: 15,
		color: "#111827",
	},
	button: {
		backgroundColor: "#1D4ED8",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		marginBottom: 15,
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
	},
	orText: {
		marginBottom: 20,
		textAlign: "center",
		color: "#6B7280",
		marginVertical: 10,
	},
	socialRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 10,
	},
	socialButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#E0E7FF",
		padding: 10,
		borderRadius: 8,
		gap: 8,
	},
	socialText: {
		fontWeight: "bold",
		color: "#111827",
		marginLeft: 8,
	},
	footer: {
		textAlign: "center",
		color: "#6B7280",
		marginTop: 20,
	},
	linkText: {
		color: "#1D4ED8",
		fontWeight: "bold",
	},
	rowBetween: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 15,
	},
	rightAlignRow: {
		flexDirection: "row",
		justifyContent: "flex-end",
		marginBottom: 15,
	},
	rememberText: {
		color: "#6B7280",
	},
	resendOtp: {
		color: "#1D4ED8",
		textAlign: "center",
		marginTop: 10,
		fontWeight: "500",
	},
})
