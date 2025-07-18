import React, { useEffect, useRef, useState } from "react"
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
	ScrollView,
	StatusBar,
	Alert,
} from "react-native"
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av"
import { Audio } from "expo-av"
import { useLocalSearchParams, useRouter } from "expo-router"
import Svg, { Path, Text as SvgText } from "react-native-svg"
import { Ionicons } from "@expo/vector-icons"
import Header from "./Header_1"

const { width } = Dimensions.get("window")

const frameTimestamps = [0, 1000, 2000, 3000, 4000, 5000]

interface FeedbackData {
	id: string
	email: string
	sessionTitle: string
	videoThumbnail: string
	videoUri: string
	videoId: string
	studentId: string
	coachId: string
	textNotes: string
	drills: Array<{ id: string; name: string; icon: string }>
	exercises: Array<{ name: string; icon: string }>
	explainers: Array<{ name: string; icon: string }>
	voiceNoteUri: string
	createdAt: string
}

const AnnotedVideoPlayer = () => {
	const router = useRouter()
	const params = useLocalSearchParams()

	const {
		videoSource,
		title,
		description,
		annotations: annotationJson,
		hasAnnotations,
	} = params

	const [status, setStatus] = useState<AVPlaybackStatus | null>(null)
	const [isLoading, setIsLoading] = useState(true)
	const [annotations, setAnnotations] = useState<any[]>([])
	const [currentFrame, setCurrentFrame] = useState(1)
	const [visibleAnnotations, setVisibleAnnotations] = useState<any[]>([])
	
	// Feedback related states
	const [showFeedback, setShowFeedback] = useState(false)
	const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
	const [feedbackLoading, setFeedbackLoading] = useState(false)
	const [audioSound, setAudioSound] = useState<Audio.Sound | null>(null)
	const [isAudioPlaying, setIsAudioPlaying] = useState(false)
	const [audioLoading, setAudioLoading] = useState(false)
	const [audioStatus, setAudioStatus] = useState<any>(null)

	const videoRef = useRef<Video>(null)

	useEffect(() => {
		if (hasAnnotations === "true" && annotationJson) {
			try {
				const parsed = JSON.parse(annotationJson as string)
				setAnnotations(Array.isArray(parsed) ? parsed : [])
			} catch (err) {
				console.error("Failed to parse annotations:", err)
			}
		}
	}, [annotationJson, hasAnnotations])

	useEffect(() => {
		const currentFrameTimestamp = frameTimestamps[currentFrame - 1]
		const visible = annotations.filter(
			(annotation) => annotation.frameTimestamp === currentFrameTimestamp
		)
		setVisibleAnnotations(visible)
	}, [currentFrame, annotations])

	useEffect(() => {
		// Configure audio mode
		const configureAudio = async () => {
			try {
				await Audio.setAudioModeAsync({
					allowsRecordingIOS: false,
					staysActiveInBackground: false,
					playsInSilentModeIOS: true,
					shouldDuckAndroid: true,
					playThroughEarpieceAndroid: false,
				})
			} catch (error) {
				console.error('Error configuring audio:', error)
			}
		}
		configureAudio()

		return () => {
			// Cleanup audio when component unmounts
			if (audioSound) {
				audioSound.unloadAsync().catch(console.error)
			}
		}
	}, [])

	useEffect(() => {
		return () => {
			if (audioSound) {
				audioSound.unloadAsync().catch(console.error)
			}
		}
	}, [audioSound])

	const handlePlaybackStatusUpdate = (playbackStatus: AVPlaybackStatus) => {
		setStatus(playbackStatus)
		if (playbackStatus.isLoaded && !playbackStatus.isBuffering) {
			setIsLoading(false)
			const currentTime = playbackStatus.positionMillis
			let closestFrame = 1
			let minDiff = Infinity
			frameTimestamps.forEach((timestamp, index) => {
				const diff = Math.abs(currentTime - timestamp)
				if (diff < minDiff) {
					minDiff = diff
					closestFrame = index + 1
				}
			})
			if (closestFrame !== currentFrame) {
				setCurrentFrame(closestFrame)
			}
		}
	}

	const handleFrameSelect = async (frameNumber: number) => {
		setCurrentFrame(frameNumber)
		if (videoRef.current) {
			await videoRef.current.setPositionAsync(frameTimestamps[frameNumber - 1])
		}
	}

	const fetchFeedback = async () => {
		setFeedbackLoading(true)
		try {
			// Extract videoId from videoSource - need to get the filename from the URL path, not query params
			const url = new URL(videoSource as string)
			const pathSegments = url.pathname.split('/')
			const videoId = pathSegments[pathSegments.length - 1] // Get the last segment which is the filename
			
			console.log('Video Source:', videoSource)
			console.log('URL pathname:', url.pathname)
			console.log('Path segments:', pathSegments)
			console.log('Extracted Video ID:', videoId)
			
			const apiUrl = `https://becomebetter-api.azurewebsites.net/api/GetFeedbackByVideoId?videoId=${videoId}`
			console.log('API URL:', apiUrl)
			
			const response = await fetch(apiUrl)
			console.log('Response status:', response.status)
			
			if (response.ok) {
				const data = await response.json()
				console.log('Feedback data:', data)
				setFeedbackData(data)
			} else {
				const errorText = await response.text()
				console.log('Error response:', errorText)
				Alert.alert('Error', `Failed to fetch feedback data: ${response.status}`)
			}
		} catch (error) {
			console.error('Error fetching feedback:', error)
			Alert.alert('Error', 'Failed to fetch feedback data')
		} finally {
			setFeedbackLoading(false)
		}
	}

	const handleToggleFeedback = async () => {
		if (!showFeedback && !feedbackData) {
			await fetchFeedback()
		}
		setShowFeedback(!showFeedback)
	}

	const handleAudioPlayPause = async () => {
		if (!feedbackData?.voiceNoteUri) return

		try {
			setAudioLoading(true)

			if (audioSound) {
				const status = await audioSound.getStatusAsync()
				if (status.isLoaded) {
					if (status.isPlaying) {
						await audioSound.pauseAsync()
						setIsAudioPlaying(false)
					} else {
						await audioSound.playAsync()
						setIsAudioPlaying(true)
					}
				} else {
					// Sound was unloaded, recreate it
					await loadAndPlayAudio()
				}
			} else {
				// No sound object, create new one
				await loadAndPlayAudio()
			}
		} catch (error) {
			console.error('Error in audio play/pause:', error)
			Alert.alert('Error', 'Failed to play audio')
			setIsAudioPlaying(false)
		} finally {
			setAudioLoading(false)
		}
	}

	const loadAndPlayAudio = async () => {
		try {
			// Clean up existing sound first
			if (audioSound) {
				await audioSound.unloadAsync()
				setAudioSound(null)
			}

			const { sound } = await Audio.Sound.createAsync(
				{ uri: feedbackData!.voiceNoteUri },
				{ shouldPlay: true, volume: 1.0 },
				onPlaybackStatusUpdate
			)

			setAudioSound(sound)
			setIsAudioPlaying(true)
		} catch (error) {
			console.error('Error loading audio:', error)
			Alert.alert('Error', 'Failed to load audio file')
			setIsAudioPlaying(false)
		}
	}

	const onPlaybackStatusUpdate = (status: any) => {
		setAudioStatus(status)
		if (status.isLoaded) {
			setIsAudioPlaying(status.isPlaying)
			if (status.didJustFinish) {
				setIsAudioPlaying(false)
				// Optionally reload the sound for replay
				if (audioSound) {
					audioSound.setPositionAsync(0)
				}
			}
		} else if (status.error) {
			console.error('Audio playback error:', status.error)
			setIsAudioPlaying(false)
		}
	}

	const stopAudio = async () => {
		if (audioSound) {
			try {
				await audioSound.stopAsync()
				setIsAudioPlaying(false)
			} catch (error) {
				console.error('Error stopping audio:', error)
			}
		}
	}

	const getIconName = (iconType: string) => {
		switch (iconType) {
			case 'run':
				return 'fitness-outline'
			case 'lightbulb-on':
				return 'bulb-outline'
			default:
				return 'information-circle-outline'
		}
	}

	const renderAnnotation = (annotation, index) => {
		switch (annotation.type) {
			case "pen":
			case "marker":
				return annotation.path ? (
					<Path
						key={index}
						d={annotation.path}
						stroke={annotation.color || "#FF0000"}
						strokeWidth={annotation.strokeWidth || 4}
						opacity={annotation.opacity ?? 1}
						fill="none"
					/>
				) : null
			case "text":
				return (
					<SvgText
						key={index}
						x={annotation.x || 0}
						y={annotation.y || 0}
						fontSize={annotation.fontSize || 18}
						fill={annotation.color || "#00BFFF"}
					>
						{annotation.text}
					</SvgText>
				)
			default:
				return null
		}
	}

	const renderFeedbackSection = () => {
		if (!showFeedback) return null

		if (feedbackLoading) {
			return (
				<View style={styles.feedbackContainer}>
					<ActivityIndicator size="large" color="#1D4ED8" />
					<Text style={styles.loadingText}>Loading feedback...</Text>
				</View>
			)
		}

		if (!feedbackData) {
			return (
				<View style={styles.feedbackContainer}>
					<Text style={styles.noFeedbackText}>No feedback available for this video</Text>
					<Text style={styles.debugText}>
						Video ID: {(() => {
							try {
								const url = new URL(videoSource as string)
								const pathSegments = url.pathname.split('/')
								return pathSegments[pathSegments.length - 1] || 'Unknown'
							} catch {
								return 'Invalid URL'
							}
						})()}
					</Text>
				</View>
			)
		}

		return (
			<View style={styles.feedbackContainer}>
				<Text style={styles.feedbackTitle}>Coach Feedback</Text>
				
				{/* Text Notes */}
				{feedbackData.textNotes && (
					<View style={styles.feedbackSection}>
						<Text style={styles.sectionTitle}>Notes</Text>
						<Text style={styles.notesText}>{feedbackData.textNotes}</Text>
					</View>
				)}

				{/* Voice Note */}
				{feedbackData.voiceNoteUri && (
					<View style={styles.feedbackSection}>
						<Text style={styles.sectionTitle}>Voice Note</Text>
						<View style={styles.audioContainer}>
							<TouchableOpacity
								style={[styles.audioButton, audioLoading && styles.audioButtonDisabled]}
								onPress={handleAudioPlayPause}
								disabled={audioLoading}
							>
								{audioLoading ? (
									<ActivityIndicator size="small" color="#fff" />
								) : (
									<Ionicons
										name={isAudioPlaying ? "pause" : "play"}
										size={20}
										color="#fff"
									/>
								)}
								<Text style={styles.audioButtonText}>
									{audioLoading ? "Loading..." : isAudioPlaying ? "Pause" : "Play"} Audio
								</Text>
							</TouchableOpacity>
							
							{audioSound && (
								<TouchableOpacity
									style={styles.stopButton}
									onPress={stopAudio}
								>
									<Ionicons name="stop" size={16} color="#666" />
								</TouchableOpacity>
							)}
						</View>
						
						{audioStatus && audioStatus.isLoaded && (
							<View style={styles.audioProgress}>
								<Text style={styles.audioTime}>
									{Math.floor((audioStatus.positionMillis || 0) / 1000)}s / {Math.floor((audioStatus.durationMillis || 0) / 1000)}s
								</Text>
							</View>
						)}
					</View>
				)}

				{/* Drills */}
				{feedbackData.drills && feedbackData.drills.length > 0 && (
					<View style={styles.feedbackSection}>
						<Text style={styles.sectionTitle}>Recommended Drills</Text>
						{feedbackData.drills.map((drill, index) => (
							<View key={index} style={styles.itemRow}>
								<Ionicons
									name={getIconName(drill.icon)}
									size={20}
									color="#1D4ED8"
								/>
								<Text style={styles.itemText}>{drill.name}</Text>
							</View>
						))}
					</View>
				)}

				{/* Exercises */}
				{feedbackData.exercises && feedbackData.exercises.length > 0 && (
					<View style={styles.feedbackSection}>
						<Text style={styles.sectionTitle}>Exercises</Text>
						{feedbackData.exercises.map((exercise, index) => (
							<View key={index} style={styles.itemRow}>
								<Ionicons
									name={getIconName(exercise.icon)}
									size={20}
									color="#1D4ED8"
								/>
								<Text style={styles.itemText}>{exercise.name}</Text>
							</View>
						))}
					</View>
				)}

				{/* Explainers */}
				{feedbackData.explainers && feedbackData.explainers.length > 0 && (
					<View style={styles.feedbackSection}>
						<Text style={styles.sectionTitle}>Explainers</Text>
						{feedbackData.explainers.map((explainer, index) => (
							<View key={index} style={styles.itemRow}>
								<Ionicons
									name={getIconName(explainer.icon)}
									size={20}
									color="#1D4ED8"
								/>
								<Text style={styles.itemText}>{explainer.name}</Text>
							</View>
						))}
					</View>
				)}
			</View>
		)
	}

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#f5f5f5" />
			<Header title="Annotated Video" />

			<ScrollView style={styles.scrollContainer}>
				<View style={styles.videoContainer}>
					<Video
						ref={videoRef}
						source={{ uri: videoSource as string }}
						style={styles.video}
						resizeMode={ResizeMode.CONTAIN}
						useNativeControls
						onLoadStart={() => setIsLoading(true)}
						onReadyForDisplay={() => setIsLoading(false)}
						onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
					/>

					{isLoading && (
						<ActivityIndicator
							size="large"
							color="#FFD700"
							style={styles.loading}
						/>
					)}

					{hasAnnotations === "true" && visibleAnnotations.length > 0 && (
						<View style={styles.annotationLayer} pointerEvents="none">
							<Svg style={StyleSheet.absoluteFill}>
								{visibleAnnotations.map((ann, i) =>
									renderAnnotation(ann, i)
								)}
							</Svg>
						</View>
					)}
				</View>

				<View style={styles.frameNav}>
					<Text style={styles.frameLabel}>Select Frame:</Text>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={styles.frameList}
					>
						{frameTimestamps.map((_, index) => {
							const frameNumber = index + 1
							const isActive = frameNumber === currentFrame
							const count = annotations.filter(
								(a) => a.frameTimestamp === frameTimestamps[index]
							).length

							return (
								<TouchableOpacity
									key={frameNumber}
									style={[
										styles.frameButton,
										isActive && styles.frameButtonActive,
									]}
									onPress={() => handleFrameSelect(frameNumber)}
								>
									<Text
										style={[
											styles.frameText,
											isActive && styles.frameTextActive,
										]}
									>
										Frame {frameNumber}
									</Text>
									{count > 0 && (
										<View style={styles.badge}>
											<Text style={styles.badgeText}>{count}</Text>
										</View>
									)}
								</TouchableOpacity>
							)
						})}
					</ScrollView>
				</View>

				<View style={styles.infoBox}>
					<Text style={styles.title}>{title || "Untitled Video"}</Text>
					<Text style={styles.description}>{description || "No description"}</Text>
					<Text style={styles.status}>
						Current Frame: {currentFrame} • Annotations:{" "}
						{visibleAnnotations.length}
					</Text>
					
					{/* Feedback Toggle Button */}
					<TouchableOpacity
						style={styles.feedbackToggle}
						onPress={handleToggleFeedback}
					>
						<Ionicons
							name={showFeedback ? "chevron-up" : "chevron-down"}
							size={20}
							color="#1D4ED8"
						/>
						<Text style={styles.feedbackToggleText}>
							{showFeedback ? "Hide Feedback" : "Show Feedback"}
						</Text>
					</TouchableOpacity>
				</View>

				{renderFeedbackSection()}
			</ScrollView>
		</View>
	)
}

export default AnnotedVideoPlayer

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	scrollContainer: {
		flex: 1,
	},
	videoContainer: {
		width: "100%",
		height: 380,
		backgroundColor: "#f5f5f5",
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 10,
		overflow: "hidden",
	},
	video: {
		width: "100%",
		height: "100%",
		backgroundColor: "#f5f5f5",
	},
	loading: {
		position: "absolute",
		top: "45%",
		left: "45%",
	},
	annotationLayer: {
		...StyleSheet.absoluteFillObject,
		zIndex: 2,
	},
	frameNav: {
		backgroundColor: "#fff",
		paddingVertical: 12,
		paddingHorizontal: 16,
		marginTop: 10,
		marginBottom: 12,
		borderRadius: 8,
		elevation: 4,
		marginHorizontal: 10,
	},
	frameLabel: {
		color: "#333",
		fontSize: 15,
		fontWeight: "bold",
		marginBottom: 8,
		marginTop: 10,
	},
	frameList: {
		paddingRight: 16,
	},
	frameButton: {
		backgroundColor: "#f0f0f0",
		paddingVertical: 10,
		paddingHorizontal: 16,
		borderRadius: 8,
		borderWidth: 2,
		borderColor: "#ddd",
		marginRight: 8,
		marginTop: 10,
	},
	frameButtonActive: {
		backgroundColor: "#1D4ED8",
		borderColor: "#1D4ED8",
	},
	frameText: {
		color: "#666",
		fontSize: 13,
		fontWeight: "600",
	},
	frameTextActive: {
		color: "#fff",
	},
	badge: {
		position: "absolute",
		top: -8,
		right: -8,
		backgroundColor: "#FF3030",
		borderRadius: 10,
		width: 20,
		height: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	badgeText: {
		fontSize: 10,
		fontWeight: "bold",
		color: "#fff",
	},
	infoBox: {
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 8,
		marginHorizontal: 10,
		marginBottom: 16,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 8,
	},
	description: {
		fontSize: 14,
		color: "#666",
		marginBottom: 10,
	},
	status: {
		fontSize: 13,
		color: "#1D4ED8",
		marginBottom: 16,
	},
	feedbackToggle: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		backgroundColor: "#f0f7ff",
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#1D4ED8",
	},
	feedbackToggleText: {
		color: "#1D4ED8",
		fontSize: 16,
		fontWeight: "600",
		marginLeft: 8,
	},
	feedbackContainer: {
		backgroundColor: "#fff",
		padding: 16,
		borderRadius: 8,
		marginHorizontal: 10,
		marginBottom: 16,
	},
	loadingText: {
		textAlign: "center",
		color: "#666",
		marginTop: 10,
	},
	noFeedbackText: {
		textAlign: "center",
		color: "#666",
		fontSize: 16,
	},
	feedbackTitle: {
		fontSize: 20,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 16,
		textAlign: "center",
	},
	feedbackSection: {
		marginBottom: 20,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 12,
	},
	notesText: {
		fontSize: 14,
		color: "#666",
		lineHeight: 20,
		backgroundColor: "#f8f9fa",
		padding: 12,
		borderRadius: 8,
	},
	audioButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#1D4ED8",
		paddingVertical: 12,
		paddingHorizontal: 20,
		borderRadius: 8,
		flex: 1,
		marginRight: 8,
	},
	audioButtonDisabled: {
		backgroundColor: "#94A3B8",
	},
	audioButtonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "600",
		marginLeft: 8,
	},
	audioContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	stopButton: {
		backgroundColor: "#f0f0f0",
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#ddd",
	},
	audioProgress: {
		marginTop: 8,
		alignItems: "center",
	},
	audioTime: {
		fontSize: 12,
		color: "#666",
	},
	itemRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingVertical: 8,
		paddingHorizontal: 12,
		backgroundColor: "#f8f9fa",
		borderRadius: 6,
		marginBottom: 8,
	},
	itemText: {
		fontSize: 14,
		color: "#333",
		marginLeft: 12,
		flex: 1,
	},
	debugText: {
		fontSize: 12,
		color: "#999",
		marginTop: 8,
		textAlign: "center",
	},
})