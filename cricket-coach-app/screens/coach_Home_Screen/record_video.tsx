import React, { useEffect, useRef, useState } from "react"
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Alert,
	ActivityIndicator,
	Platform,
	PanResponder,
	Dimensions,
	Modal,
} from "react-native"
import * as FileSystem from "expo-file-system"
import { CameraView, useCameraPermissions } from "expo-camera"
import { Video } from "expo-av"
import { Entypo } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import Header from "./Header_1"

import { useSelector } from "react-redux"

import { styles } from "@/styles/recordVideoStyle"
import { RootState } from "@/store/store"

type Params = { coachId: string }
type RecordedVideo = { uri: string }

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

export default function RecordVideoScreen() {
	const { coachId } = useLocalSearchParams<Params>()
	const router = useRouter()
	const studentId = useSelector((state: RootState) => state.user.id)
	const cameraRef = useRef<CameraView>(null)
	const [permission, requestPermission] = useCameraPermissions()
	const [isRecording, setIsRecording] = useState(false)
	const [isReady, setIsReady] = useState(false)

	const [zoom, setZoom] = useState(0)
	const [recordingTime, setRecordingTime] = useState(0)
	const recordingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
		null
	)

	const [initialDistance, setInitialDistance] = useState(0)
	const [initialZoom, setInitialZoom] = useState(0)
	const [showZoomSlider, setShowZoomSlider] = useState(false)
	const zoomSliderTimeout = useRef<number | null>(null)
	const [recordedVideoUri, setRecordedVideoUri] = useState<string | null>(null)
	const [showPreview, setShowPreview] = useState(false)

	const handleVideoUpload = async (
		videoUri: string,
		uploadedBy: string, // student email
		assignedCoachId: string,
		filename: string,
		durationSeconds: number,
		onSuccess: () => void,
		onFailure: () => void
	) => {
		try {
			const base64 = await FileSystem.readAsStringAsync(videoUri, {
				encoding: FileSystem.EncodingType.Base64,
			})

			const response = await fetch(
				"https://becomebetter-api.azurewebsites.net/api/UploadVideo",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						videoData: base64,
						filename,
						uploadedBy,
						assignedCoachId,
						durationSeconds,
						studentId, // ✅ include studentId in request body
					}),
				}
			)

			const resText = await response.text()

			console.log("Status:", response.status)
			console.log("Response body:", resText)

			if (!response.ok) throw new Error("Upload failed")

			try {
				const result = JSON.parse(resText)
				console.log("✅ Upload success:", result)
			} catch (e) {
				console.warn("Response is not JSON:", resText)
			}

			Alert.alert("Success", "Video uploaded successfully!")
			onSuccess()
		} catch (error) {
			console.error("Upload error:", error)
			Alert.alert("Error", "Failed to upload video. Try again.")
			onFailure()
		}
	}

	const getDistance = (touches: any[]) => {
		if (touches.length < 2) return 0
		const [touch1, touch2] = touches
		const dx = touch1.pageX - touch2.pageX
		const dy = touch1.pageY - touch2.pageY
		return Math.sqrt(dx * dx + dy * dy)
	}

	const showZoomSliderTemporarily = () => {
		setShowZoomSlider(true)
		if (zoomSliderTimeout.current) {
			clearTimeout(zoomSliderTimeout.current)
		}
		zoomSliderTimeout.current = setTimeout(() => {
			setShowZoomSlider(false)
		}, 2000)
	}

	const panResponder = PanResponder.create({
		onStartShouldSetPanResponder: () => true,
		onMoveShouldSetPanResponder: () => true,
		onPanResponderGrant: (evt) => {
			const touches = evt.nativeEvent.touches
			if (touches.length === 2) {
				const distance = getDistance(touches)
				setInitialDistance(distance)
				setInitialZoom(zoom)
				showZoomSliderTemporarily()
			} else if (touches.length === 1) {
				showZoomSliderTemporarily()
			}
		},
		onPanResponderMove: (evt, gestureState) => {
			const touches = evt.nativeEvent.touches
			if (touches.length === 2 && initialDistance > 0) {
				const currentDistance = getDistance(touches)
				const distanceRatio = currentDistance / initialDistance
				const zoomChange = (distanceRatio - 1) * 0.5
				const newZoom = Math.max(0, Math.min(1, initialZoom + zoomChange))
				setZoom(newZoom)
			} else if (touches.length === 1) {
				const verticalMovement = -gestureState.dy
				const zoomSensitivity = 0.003
				const zoomChange = verticalMovement * zoomSensitivity
				const newZoom = Math.max(0, Math.min(1, zoom + zoomChange))
				setZoom(newZoom)
			}
		},
		onPanResponderRelease: () => {
			setInitialDistance(0)
			setInitialZoom(0)
		},
	})

	useEffect(() => {
		return () => {
			stopRecordingTimer()
			if (zoomSliderTimeout.current) {
				clearTimeout(zoomSliderTimeout.current)
			}
		}
	}, [])

	const userEmail = useSelector((state: RootState) => state.user.email)

	useEffect(() => {
		const requestCameraPermission = async () => {
			if (!permission) return
			if (!permission.granted) {
				const { granted } = await requestPermission()
				if (!granted) {
					Alert.alert(
						"Camera Permission Required",
						"Please enable camera access to record videos.",
						[{ text: "OK" }]
					)
				}
			}
		}

		requestCameraPermission()
	}, [permission, requestPermission])

	const startRecordingTimer = () => {
		setRecordingTime(0)
		recordingIntervalRef.current = setInterval(() => {
			setRecordingTime((prev) => {
				const newTime = prev + 1
				if (newTime >= 5) {
					handleStopRecording(newTime)
				}
				return newTime
			})
		}, 1000)
	}

	const stopRecordingTimer = () => {
		if (recordingIntervalRef.current) {
			clearInterval(recordingIntervalRef.current)
			recordingIntervalRef.current = null
		}
	}

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins.toString().padStart(2, "0")}:${secs
			.toString()
			.padStart(2, "0")}`
	}
	const handleRecord = async () => {
		if (!cameraRef.current || isRecording || !isReady) return
		if (!permission?.granted) {
			Alert.alert("Error", "Camera permission is required to record videos.")
			return
		}

		setIsRecording(true)
		startRecordingTimer()

		try {
			let recordingOptions: any = { maxDuration: 5 }
			if (Platform.OS === "ios") {
				recordingOptions = { ...recordingOptions, quality: "720p", mute: false }
			} else {
				recordingOptions = { ...recordingOptions, quality: "medium" }
			}

			const video = await cameraRef.current.recordAsync(recordingOptions)
			setRecordedVideoUri(video?.uri ?? null)
			setShowPreview(true)
		} catch (error: any) {
			Alert.alert(
				"Recording Error",
				error.message || "Could not record video. Please try again."
			)
		} finally {
			setIsRecording(false)
			stopRecordingTimer()
		}
	}

	const handleStopRecording = async (timeFromTimer?: number) => {
		if (!cameraRef.current || !isRecording) return

		try {
			const finalTime = timeFromTimer || recordingTime

			await cameraRef.current.stopRecording() // ✅ No return value

			// `setRecordedVideoUri` should already be triggered inside recordAsync flow
			setShowPreview(true)
		} catch (error: any) {
			console.error("Stop recording error:", error)
		} finally {
			setIsRecording(false)
			stopRecordingTimer()
		}
	}

	const setZoomLevel = (level: number) => {
		setZoom(level)
		showZoomSliderTemporarily()
	}

	const handleRecordButtonPress = () => {
		if (isRecording) {
			handleStopRecording()
		} else {
			handleRecord()
		}
	}

	if (!permission) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" />
				<Text style={styles.loadingText}>Loading camera...</Text>
			</View>
		)
	}

	if (!permission.granted) {
		return (
			<View style={styles.center}>
				<Text style={styles.permissionText}>
					Camera access is required to record videos
				</Text>
				<TouchableOpacity
					onPress={requestPermission}
					style={styles.permissionButton}
				>
					<Text style={styles.permissionButtonText}>
						Grant Camera Permission
					</Text>
				</TouchableOpacity>
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<Header title="Record Video" />

			<View style={{ flex: 1, position: "relative" }}>
				<CameraView
					ref={cameraRef}
					style={styles.cameraPreview}
					facing="back"
					zoom={zoom}
					mode="video"
					onCameraReady={() => setIsReady(true)}
					onMountError={(error) =>
						Alert.alert(
							"Camera Error",
							"Failed to initialize camera: " + error.message
						)
					}
				/>

				<View
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: "transparent",
					}}
					{...panResponder.panHandlers}
				/>

				{(showZoomSlider || zoom > 0) && (
					<View
						style={{
							position: "absolute",
							top: 50,
							right: 20,
							backgroundColor: "rgba(0, 0, 0, 0.7)",
							paddingHorizontal: 12,
							paddingVertical: 8,
							borderRadius: 20,
							minWidth: 60,
							alignItems: "center",
						}}
					>
						<Text
							style={{
								color: "white",
								fontSize: 14,
								fontWeight: "bold",
								textAlign: "center",
							}}
						>
							{zoom === 0 ? "1x" : `${(1 + zoom * 4).toFixed(1)}x`}
						</Text>
					</View>
				)}

				{isRecording && (
					<View
						style={{
							position: "absolute",
							top: 20,
							left: 0,
							right: 0,
							alignItems: "center",
						}}
					>
						<View
							style={{
								backgroundColor: "rgba(255, 0, 0, 0.8)",
								paddingHorizontal: 16,
								paddingVertical: 8,
								borderRadius: 20,
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<View
								style={{
									width: 8,
									height: 8,
									backgroundColor: "white",
									borderRadius: 4,
									marginRight: 8,
								}}
							/>
							<Text
								style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
							>
								REC {formatTime(recordingTime)}
							</Text>
						</View>
					</View>
				)}
			</View>

			<View style={styles.controls}>
				<View
					style={{
						flexDirection: "row",
						marginBottom: 20,
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					{[
						{ level: 0, label: "1x" },
						{ level: 0.25, label: "2x" },
						{ level: 0.5, label: "3x" },
						{ level: 1, label: "5x" },
					].map((item, idx) => (
						<TouchableOpacity
							key={idx}
							onPress={() => setZoomLevel(item.level)}
							style={[
								quickZoomButtonStyle,
								Math.abs(zoom - item.level) < 0.05 && {
									backgroundColor: "rgba(255, 255, 255, 0.3)",
								},
							]}
						>
							<Text style={quickZoomTextStyle}>{item.label}</Text>
						</TouchableOpacity>
					))}
				</View>

				<TouchableOpacity
					onPress={handleRecordButtonPress}
					disabled={!isReady}
					style={[
						styles.recordButton,
						isRecording && styles.recordButtonActive,
						!isReady && styles.recordButtonDisabled,
					]}
				>
					{isRecording ? (
						<Entypo name="controller-stop" size={36} color="#fff" />
					) : (
						<Entypo name="controller-record" size={36} color="#fff" />
					)}
				</TouchableOpacity>
			</View>

			{/* Video Preview Modal */}
			<Modal
				visible={showPreview}
				animationType="slide"
				presentationStyle="fullScreen"
				onRequestClose={() => setShowPreview(false)}
			>
				<View style={{ flex: 1, backgroundColor: "black" }}>
					<View
						style={{
							position: "absolute",
							top: 50,
							left: 20,
							right: 20,
							zIndex: 1,
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<TouchableOpacity
							onPress={() => setShowPreview(false)}
							style={{
								backgroundColor: "rgba(0, 0, 0, 0.7)",
								padding: 12,
								borderRadius: 25,
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Entypo name="chevron-left" size={24} color="white" />
							<Text style={{ color: "white", marginLeft: 5, fontSize: 16 }}>
								Back
							</Text>
						</TouchableOpacity>

						<Text
							style={{
								color: "white",
								fontSize: 18,
								fontWeight: "bold",
								backgroundColor: "rgba(0, 0, 0, 0.7)",
								paddingHorizontal: 16,
								paddingVertical: 8,
								borderRadius: 20,
							}}
						>
							Video Preview
						</Text>
					</View>

					{recordedVideoUri && (
						<Video
							source={{ uri: recordedVideoUri }}
							style={{ flex: 1 }}
							useNativeControls
							isLooping
							shouldPlay={false}
						/>
					)}

					<View
						style={{
							position: "absolute",
							bottom: 50,
							left: 20,
							right: 20,
							flexDirection: "row",
							justifyContent: "space-around",
						}}
					>
						<TouchableOpacity
							onPress={() => {
								if (recordedVideoUri) {
									console.log("✅ Video saved to logs:")
									console.log("URI:", recordedVideoUri)
									console.log("Duration (approx):", recordingTime, "seconds")

									const studentEmail = userEmail || "unknown@user.com"
									const timestamp = Date.now()
									const filename = `${studentEmail.replace(
										/[@.]/g,
										"_"
									)}_${timestamp}.mp4`

									handleVideoUpload(
										recordedVideoUri,
										studentId, // ✅ Pass studentId as 7th argument
										coachId,
										filename,
										recordingTime,
										() => setShowPreview(false),
										() => {}
									)
								}
							}}
							style={{
								backgroundColor: "rgba(255, 255, 255, 0.9)",
								paddingHorizontal: 24,
								paddingVertical: 12,
								borderRadius: 25,
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Entypo name="check" size={20} color="green" />
							<Text
								style={{ color: "green", marginLeft: 8, fontWeight: "bold" }}
							>
								Done
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							onPress={() => {
								setShowPreview(false)
							}}
							style={{
								backgroundColor: "rgba(255, 0, 0, 0.9)",
								paddingHorizontal: 24,
								paddingVertical: 12,
								borderRadius: 25,
								flexDirection: "row",
								alignItems: "center",
							}}
						>
							<Entypo name="controller-record" size={20} color="white" />
							<Text
								style={{ color: "white", marginLeft: 8, fontWeight: "bold" }}
							>
								Record Again
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</View>
	)
}

const quickZoomButtonStyle = {
	backgroundColor: "rgba(0, 0, 0, 0.5)",
	paddingHorizontal: 16,
	paddingVertical: 8,
	borderRadius: 20,
	marginHorizontal: 5,
	minWidth: 45,
	alignItems: "center" as const,
}

const quickZoomTextStyle = {
	color: "black",
	fontSize: 14,
	fontWeight: "bold" as const,
}
