import { Feather } from "@expo/vector-icons"
import React from "react"
import {
	Dimensions,
	FlatList,
	Image,
	ScrollView,
	Text,
	TouchableOpacity,
	View,
} from "react-native"
import { styles } from "../styles/StudentsStyles"

type Student = {
	id: string
	name: string
	photoUrl: string
}

const students: Student[] = [
	{
		id: "1",
		name: "Andy",
		photoUrl: "https://picsum.photos/200/300",
	},
	{
		id: "2",
		name: "Brian",
		photoUrl: "https://picsum.photos/200/300",
	},
	{
		id: "3",
		name: "Josh",
		photoUrl: "https://picsum.photos/200/300",
	},
	// Add more...
]

const { width } = Dimensions.get("window")
const numColumns = 2
const itemMargin = 20
const itemWidth = (width - itemMargin * (numColumns + 1)) / numColumns

const StudentsScreen = () => {
	const renderItem = ({ item }: { item: Student }) => (
		<TouchableOpacity
			style={{
				width: itemWidth,
				aspectRatio: 1, // Square shape
			}}
		>
			<View style={styles.imageContainer}>
				<Image
					source={{ uri: item.photoUrl }}
					style={styles.studentImage}
					resizeMode="cover"
				/>
				<View style={styles.overlay}>
					<Text style={styles.overlayText}>{item.name}</Text>
				</View>
			</View>
		</TouchableOpacity>
	)

	return (
		<ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
			{/* <View style={styles.header}>
				<Feather name="user" size={50} color="#1D4ED8" />
				<Text style={styles.title}>Students</Text>
			</View> */}

			{/* {students.map((student, index) => (
				<TouchableOpacity key={index} style={styles.item}>
					<FontAwesome name="user" size={20} color="#111827" />
					<Text style={styles.itemText}>{student}</Text>
				</TouchableOpacity>
			))} */}

			<FlatList
				data={students}
				renderItem={renderItem}
				keyExtractor={(item, index) => index.toString()}
				numColumns={numColumns}
				columnWrapperStyle={{
					justifyContent: "space-between",
					marginBottom: itemMargin,
				}}
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 20 }}
			/>

			<TouchableOpacity style={styles.item}>
				<Feather name="user-plus" size={20} color="#111827" />
				<Text style={styles.itemText}>Add Student</Text>
			</TouchableOpacity>

			<TouchableOpacity style={styles.item}>
				<Feather name="settings" size={20} color="#111827" />
				<Text style={styles.itemText}>Settings</Text>
			</TouchableOpacity>
		</ScrollView>
	)
}

export default StudentsScreen
