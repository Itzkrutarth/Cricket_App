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
} from "react-native"
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av"
import { useLocalSearchParams, useRouter } from "expo-router"
import Svg, { Path, Text as SvgText } from "react-native-svg"
import { Ionicons } from "@expo/vector-icons"
import Header from "./Header_1"

const { width } = Dimensions.get("window")

const frameTimestamps = [0, 1000, 2000, 3000, 4000, 5000]

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

	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" backgroundColor="#f5f5f5" />
			<Header title="Annotated Video" />

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
			</View>
		</View>
	)
}

export default AnnotedVideoPlayer

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
	},
	videoContainer: {
		width: "100%",
		height: "50%",
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
  backgroundColor: "#fff", // from "#111"
  paddingVertical: 12,
  paddingHorizontal: 16,
  marginTop:10,
  marginBottom: 12,
  borderRadius: 8,
  elevation: 4,
},
frameLabel: {
  color: "#333",
  fontSize: 15,
  fontWeight: "bold",
  marginBottom: 8,
   marginTop:10,
},
frameButton: {
  backgroundColor: "#f0f0f0",
  paddingVertical: 10,
  paddingHorizontal: 16,
  borderRadius: 8,
  borderWidth: 2,
  borderColor: "#ddd",
  marginRight: 8,
   marginTop:10,
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
  marginHorizontal: 1,
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
},

})
