import { Entypo, Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

type Props = {
    title: string
    onEditPress?: () => void
    playPauseButton?: React.ReactNode
}

const Header = ({ title, onEditPress, playPauseButton }: Props) => {
    const router = useRouter()

    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
                <Entypo name="chevron-left" size={30} color="
#1D4ED8" />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            {playPauseButton ? (
                playPauseButton
            ) : onEditPress ? (
                <TouchableOpacity onPress={onEditPress}>
                    <Ionicons name="create-outline" size={24} color="blue" />
                </TouchableOpacity>
            ) : (
                <View style={{ width: 40 }} />
            )}
        </View>
    )
}

export default Header

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#fff",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 50,
        paddingBottom: 12,
        paddingHorizontal: 20,
    },
    title: {
        color: "#1D4ED8",
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
    },
    editText: {
        color: "#1D4ED8",
        fontSize: 16,
        fontWeight: "500",
    },
})