import { createDrawerNavigator } from "@react-navigation/drawer"
import React from "react"
import CoachDrawerContent from "./CoachDrawerContent"
import HomeContent from "./CoachHomeContent"

const Drawer = createDrawerNavigator()

export default function CoachHomeScreen() {
	return (
		<Drawer.Navigator
			drawerContent={(props) => <CoachDrawerContent {...props} />}
		>
			<Drawer.Screen name="Home" component={HomeContent} />
		</Drawer.Navigator>
	)
}
