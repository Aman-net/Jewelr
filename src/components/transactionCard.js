import React, { useState } from "react"
import { View, Text } from "react-native"
import { Card, Snackbar, Button } from "react-native-paper"

const TransactionCard = ({ details, move, deleteTransaction }) => {
    const [isVisible, setIsVisible] = useState(false)
    //const [snak, setSnak] = useState(false)

    const toogleDelete = () => {
        setIsVisible(true)
        setTimeout(() => setIsVisible(false), 1500)
    }

    return (
        <Card
            style={{ marginTop: 8, marginHorizontal: 16 }}
            onPress={() => move()}
            onLongPress={() => toogleDelete()}
        >
            <Card.Title
                titleStyle={{ fontSize: 18 }}
                title={details.createdAt.toDate().toString().substr(0, 21)}
            />
            <Card.Content
                style={{
                    flexDirection: "row",
                    marginBottom: 8,
                    flex: 1,
                }}
            >
                <Text style={{ marginStart: 8 }}>
                    Total Fine : {details.tFine}
                </Text>
                <Text style={{ position: "absolute", left: "60%" }}>
                    Total Labour : {details.tLabour}
                </Text>
            </Card.Content>
            {isVisible ? (
                <View
                    style={{
                        height: 32,
                        backgroundColor: "red",
                        marginBottom: 8,
                        flex: 1,
                    }}
                >
                    <Button
                        onPress={() => {
                            //setSnak(true)
                            deleteTransaction(details)
                        }}
                        style={{ backgroundColor: "red" }}
                        mode="contained"
                    >
                        delete
                    </Button>
                </View>
            ) : null}
            {/* <Snackbar
                duration={300}
                visible={snak}
                style={{ marginTop: 32 }}
                onDismiss={() => setSnak(false)}
            >
                Deleted
            </Snackbar> */}
        </Card>
    )
}

export default TransactionCard
