import React, { useState, useEffect, useRef } from "react"
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Alert,
	ActivityIndicator,
} from "react-native"
import * as FileSystem from "expo-file-system"
import { CameraView, useCameraPermissions } from "expo-camera"
import { Entypo } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import Header from "./Header_1"
import { styles } from "@/styles/recordVideoStyle"

type Params = { studentId: string }
const STORAGE_BASE_URL =
	"https://becomebetterstorage.blob.core.windows.net/videos"
const SAS_TOKEN =
	"sp=rcw&st=2025-06-02T16:24:53Z&se=2025-09-02T00:24:53Z&spr=https&sv=2024-11-04&sr=c&sig=oJF5hsw550wrpdKPH%2Bg0saP3FD01e2c5NuNYB14Paj8%3D" // must start with `?`

export default function RecordVideoScreen() {
	const { studentId } = useLocalSearchParams<Params>()
	const router = useRouter()

	const cameraRef = useRef<CameraView>(null)
	const timerRef = useRef<number | null>(null)
	const [permission, requestPermission] = useCameraPermissions()
	const [isRecording, setIsRecording] = useState(false)
	const [isReady, setIsReady] = useState(false)
	const [recordingTime, setRecordingTime] = useState(0)

	const getBlobUploadUrl = (fileName: string) =>
		`${STORAGE_BASE_URL}/${fileName}${SAS_TOKEN}`

	// Ask for camera permissions
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

	// Timer effect for recording
	useEffect(() => {
		if (isRecording) {
			// Start timer
			const interval = setInterval(() => {
				setRecordingTime((prev) => {
					const newTime = prev + 1
					// Auto stop after 5 seconds
					if (newTime >= 5) {
						handleStop()
					}
					return newTime
				})
			}, 1000)

			timerRef.current = interval
		} else {
			// Clear timer when not recording
			if (timerRef.current) {
				clearInterval(timerRef.current)
				timerRef.current = null
			}
			setRecordingTime(0)
		}

		// Cleanup on unmount
		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current)
			}
		}
	}, [isRecording])

	const handleRecord = async () => {
		if (!cameraRef.current || isRecording) return
		setIsRecording(true)
		setRecordingTime(0)

		try {
			const video = await cameraRef.current.recordAsync({ maxDuration: 5 })

			if (!video?.uri) {
				throw new Error("Recording failed: video URI missing.")
			}

			console.log("🎥 Video saved to:", video.uri)

			const fileName = `student_${studentId}_video_${Date.now()}.mp4`
			await uploadVideoToAzure(video.uri, fileName)

			Alert.alert("✅ Success", "Recording & upload complete!")
		} catch (error: any) {
			console.error("❌ Recording error", error)
			Alert.alert(
				"❌ Error",
				error.message || "Could not record or upload video."
			)
		} finally {
			setIsRecording(false)
		}
	}

	// Stop recording
	const handleStop = () => {
		if (cameraRef.current && isRecording) {
			cameraRef.current.stopRecording()
		}
	}

	// Format time display
	const formatTime = (seconds: number) => {
		return `00:0${seconds}`
	}

	const uploadVideoToAzure = async (localUri: string, fileName: string) => {
		try {
			// Convert to base64 string
			const fileData = await FileSystem.readAsStringAsync(localUri, {
				encoding: FileSystem.EncodingType.Base64,
			})

			const uploadUrl = getBlobUploadUrl(fileName)

			// Upload using fetch
			const response = await fetch(uploadUrl, {
				method: "PUT",
				headers: {
					"x-ms-blob-type": "BlockBlob",
					"Content-Type": "video/mp4",
				},
				body: Buffer.from(fileData, "base64"), // Convert back to binary
			})

			if (response.ok) {
				Alert.alert("✅ Success", "Video uploaded to Azure Blob Storage!")
			} else {
				Alert.alert("❌ Upload Failed", `Status code: ${response.status}`)
			}
		} catch (err: any) {
			console.error("Upload error:", err)
			Alert.alert("❌ Error", err.message || "Upload failed.")
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

			<CameraView
				ref={cameraRef}
				style={styles.cameraPreview}
				facing="back"
				onCameraReady={() => setIsReady(true)}
			/>

			{isRecording && (
				<View style={styles.recordingIndicator}>
					<View style={styles.recordingDot} />
					<Text style={styles.recordingText}>Recording</Text>
					<Text style={styles.timerText}>{formatTime(recordingTime)}</Text>
					<Text style={styles.remainingText}>
						{5 - recordingTime}s remaining
					</Text>
				</View>
			)}

			<View style={styles.controls}>
				<TouchableOpacity
					onPress={isRecording ? handleStop : handleRecord}
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

				{isRecording && (
					<TouchableOpacity onPress={handleStop} style={styles.stopButton}>
						<Text style={styles.stopButtonText}>Stop Recording</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	)
}
