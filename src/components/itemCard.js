import React from "react"
import { View, Text } from "react-native"
import { Card } from "react-native-paper"

const ItemCard = ({ name }) => {
    return (
        <Card style={{ margin: 10 }} onPress={() => alert("item pressed")}>
            <Card.Title title={name} />
        </Card>
    )
}

export default ItemCard
