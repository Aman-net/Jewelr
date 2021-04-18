import React, { useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import {
    Card,
    Title,
    Button,
    Snackbar,
    Avatar,
    Portal,
} from "react-native-paper"

const CustomerCard = ({ movetodetails, value, disableCustomer }) => {
    const [isVisible, setIsVisible] = useState(false)
    //const [snak, setSnak] = useState(false)

    const toogleDelete = () => {
        setIsVisible(true)
        setTimeout(() => setIsVisible(false), 1500)
    }

    return (
        <Card
            style={styles.card}
            onPress={() => movetodetails(value)}
            onLongPress={() => toogleDelete()}
        >
            <Card.Title
                left={(props) => (
                    <Avatar.Text
                        {...props}
                        size={48}
                        label={value.name.charAt(0)}
                    />
                )}
                title={value.name}
                subtitle={value.address}
            />
            <Card.Content
                style={{ flex: 1, flexDirection: "row", paddingBottom: 8 }}
            >
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                    }}
                >
                    <Text>Fine Silver</Text>
                    <Title>{Math.round(value.fineWeight).toString()}</Title>
                </View>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text>Cash</Text>
                    <Title>{value.cash}</Title>
                </View>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text>Labour</Text>
                    <Title>{value.labour}</Title>
                </View>
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
                        onPress={() => disableCustomer(value.id)}
                        style={{ backgroundColor: "red" }}
                        mode="contained"
                    >
                        delete
                    </Button>
                </View>
            ) : null}
            {/* <Portal>
                <Snackbar
                    duration={1000}
                    visible={snak}
                    style={{ position: "absolute", bottom: 64 }}
                    onDismiss={() => setSnak(false)}
                >
                    Deleted
                </Snackbar>
            </Portal> */}
        </Card>
    )
}

export default CustomerCard

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginTop: 16,
    },
})
