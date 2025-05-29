import { StyleSheet, Dimensions } from "react-native"

const { width, height } = Dimensions.get("window")

export const styles = StyleSheet.create({
	// Main Container
	container: {
		flex: 1,
		backgroundColor: "#000",
	},

	// Header Styles
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: "rgba(0, 0, 0, 0.9)",
		borderBottomWidth: 1,
		borderBottomColor: "rgba(255, 255, 255, 0.1)",
	},

	headerButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		minWidth: 40,
		alignItems: "center",
	},

	headerTitle: {
		flex: 1,
		color: "white",
		fontSize: 18,
		fontWeight: "600",
		textAlign: "center",
		marginHorizontal: 16,
	},

	headerActions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},

	saveHeaderButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: "rgba(76, 175, 80, 0.2)",
		minWidth: 40,
		alignItems: "center",
	},

	// Video Container & Player
	videoContainer: {
		flex: 1,
		position: "relative",
		backgroundColor: "#f5f5f5",
	},

	video: {
		width: "100%",
		height: "100%",
	},

	savedAnnotationsOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},

	drawingOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},

	// Frame Navigation Controls
	frameNavigation: {
		position: "absolute",
		bottom: 20,
		left: 20,
		right: 20,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		backgroundColor: "rgba(0, 0, 0, 0.7)",
		borderRadius: 25,
		paddingHorizontal: 20,
		paddingVertical: 12,
	},

	navButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
	},

	disabledNavButton: {
		backgroundColor: "rgba(255, 255, 255, 0.05)",
	},

	frameInfo: {
		alignItems: "center",
	},

	frameCounter: {
		color: "#FFD700",
		fontSize: 16,
		fontWeight: "600",
	},

	frameTime: {
		color: "rgba(255, 255, 255, 0.8)",
		fontSize: 12,
		marginTop: 2,
	},

	// Video Frames Strip
	framesContainer: {
		backgroundColor: "rgba(0, 0, 0, 0.95)",
		// backgroundColor: "#ff0000",
		borderTopWidth: 1,
		borderTopColor: "rgba(255, 255, 255, 0.1)",
	},

	framesHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 16,
		paddingBottom: 8,
	},

	framesTitle: {
		color: "white",
		fontSize: 14,
		fontWeight: "600",
	},

	framesInfo: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},

	annotationCount: {
		color: "rgba(255, 255, 255, 0.7)",
		fontSize: 12,
	},

	framesToggle: {
		padding: 4,
	},

	framesScrollView: {
		paddingHorizontal: 16,
		paddingVertical: 10,
	},

	frameItem: {
		alignItems: "center",
		marginRight: 12,
		width: 64,
	},

	selectedFrame: {
		transform: [{ scale: 1.05 }],
	},

	frameThumbnail: {
		position: "relative",
		borderRadius: 8,
		overflow: "hidden",
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.2)",
	},

	selectedThumbnail: {
		borderColor: "#FFD700",
		borderWidth: 3,
	},

	annotatedThumbnail: {
		borderColor: "rgba(76, 175, 80, 0.6)",
	},

	thumbnailPlaceholder: {
		width: 60,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},

	thumbnailOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.3)",
	},

	annotationIndicator: {
		position: "absolute",
		top: 2,
		right: 2,
		backgroundColor: "#4CAF50",
		borderRadius: 8,
		minWidth: 16,
		height: 16,
		justifyContent: "center",
		alignItems: "center",
	},

	annotationBadge: {
		color: "white",
		fontSize: 10,
		fontWeight: "bold",
	},

	selectionIndicator: {
		position: "absolute",
		bottom: -2,
		right: -2,
		backgroundColor: "#000",
		borderRadius: 10,
	},

	frameTimeLabel: {
		color: "rgba(255, 255, 255, 0.7)",
		fontSize: 10,
		marginTop: 4,
		textAlign: "center",
	},

	selectedFrameTime: {
		color: "#FFD700",
		fontWeight: "600",
	},

	// Tool Palette
	toolPalette: {
		backgroundColor: "rgba(0, 0, 0, 0.95)",
		paddingHorizontal: 16,
		paddingVertical: 12,
		borderTopWidth: 1,
		borderTopColor: "rgba(255, 255, 255, 0.1)",
	},

	toolsRow: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		marginBottom: 8,
	},

	toolButton: {
		alignItems: "center",
		padding: 12,
		borderRadius: 12,
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		minWidth: 70,
		flex: 1,
		marginHorizontal: 4,
	},

	selectedTool: {
		backgroundColor: "#FFD700",
	},

	colorButton: {
		backgroundColor: "rgba(255, 255, 255, 0.15)",
	},

	actionButton: {
		backgroundColor: "rgba(255, 255, 255, 0.08)",
	},

	toolLabel: {
		color: "white",
		fontSize: 12,
		marginTop: 4,
		fontWeight: "500",
	},

	selectedToolLabel: {
		color: "#000",
		fontWeight: "600",
	},

	disabledLabel: {
		color: "#666",
	},

	colorPreview: {
		width: 24,
		height: 24,
		borderRadius: 12,
		borderWidth: 2,
		borderColor: "rgba(255, 255, 255, 0.3)",
	},

	// Status Bar
	statusBar: {
		backgroundColor: "rgba(0, 0, 0, 0.9)",
		paddingHorizontal: 16,
		paddingVertical: 8,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		flexWrap: "wrap",
		gap: 8,
	},

	statusText: {
		color: "rgba(255, 255, 255, 0.8)",
		fontSize: 12,
	},

	unsavedIndicator: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
	},

	unsavedText: {
		color: "#FF6B6B",
		fontSize: 12,
		fontWeight: "500",
	},

	// Color Picker Modal
	colorModalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		justifyContent: "center",
		alignItems: "center",
	},

	colorModalContainer: {
		backgroundColor: "#1a1a1a",
		borderRadius: 20,
		padding: 24,
		width: width * 0.85,
		maxWidth: 320,
	},

	colorModalTitle: {
		color: "white",
		fontSize: 18,
		fontWeight: "600",
		textAlign: "center",
		marginBottom: 20,
	},

	colorGrid: {
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "center",
		gap: 12,
		marginBottom: 20,
	},

	colorOption: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 3,
		borderColor: "transparent",
	},

	selectedColorOption: {
		borderColor: "#FFD700",
	},

	closeColorPickerButton: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		paddingVertical: 12,
		borderRadius: 12,
		alignItems: "center",
	},

	closeColorPickerText: {
		color: "white",
		fontSize: 16,
		fontWeight: "500",
	},

	// Text Input Modal
	textModalOverlay: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},

	textModalContainer: {
		backgroundColor: "#1a1a1a",
		borderRadius: 20,
		padding: 24,
		width: "100%",
		maxWidth: 400,
	},

	textModalTitle: {
		color: "white",
		fontSize: 18,
		fontWeight: "600",
		textAlign: "center",
		marginBottom: 8,
	},

	frameIndicator: {
		color: "rgba(255, 255, 255, 0.7)",
		fontSize: 14,
		textAlign: "center",
		marginBottom: 16,
	},

	textInput: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
		borderRadius: 12,
		padding: 16,
		color: "white",
		fontSize: 16,
		minHeight: 80,
		maxHeight: 120,
		textAlignVertical: "top",
		borderWidth: 1,
		borderColor: "rgba(255, 255, 255, 0.2)",
	},

	characterCount: {
		color: "rgba(255, 255, 255, 0.6)",
		fontSize: 12,
		textAlign: "right",
		marginTop: 8,
		marginBottom: 16,
	},

	textModalButtons: {
		flexDirection: "row",
		gap: 12,
	},

	modalButton: {
		flex: 1,
		paddingVertical: 14,
		borderRadius: 12,
		alignItems: "center",
	},

	cancelButton: {
		backgroundColor: "rgba(255, 255, 255, 0.1)",
	},

	addButton: {
		backgroundColor: "#4CAF50",
	},

	cancelButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "500",
	},

	addButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "600",
	},

	disabledButtonText: {
		color: "rgba(255, 255, 255, 0.5)",
	},
})
