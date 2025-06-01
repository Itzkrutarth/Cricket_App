import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import CoachDrawerContent from "./StudentDrawerContent";
import HomeContent from "./StudentHomeContent";

const Drawer = createDrawerNavigator();

export default function StudentHomeScreen() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CoachDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={HomeContent} />
    </Drawer.Navigator>
  );
}