import React from "react"
import { View, Text } from "react-native"
import { Button } from "react-native-paper"

const Loading = () => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Button loading>Loading</Button>
        </View>
    )
}

export default Loading
