import "react-native-gesture-handler"
import {
    setStatusBarBackgroundColor,
    setStatusBarStyle,
    StatusBar,
} from "expo-status-bar"
import React from "react"
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper"
import { NavigationContainer } from "@react-navigation/native"
import Main from "./src/main"
import { LogBox } from "react-native"

const theme = {
    ...DefaultTheme,
    roundness: 10,
    colors: {
        ...DefaultTheme.colors,
        myOwnProperty: true,
        primary: "#14213d",
        accent: "#fca311",
        text: "#141414",
        background: "#e5e5e5",
        surface: "#ffffff",
    },
}

export default function App() {
    return (
        <PaperProvider theme={theme}>
            <NavigationContainer>
                <Main />
            </NavigationContainer>
        </PaperProvider>
    )
}

LogBox.ignoreLogs(["Setting a timer", "Each child in a", "Require cycle"])
