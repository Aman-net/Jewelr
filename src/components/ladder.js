import React from "react"
import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Avatar, IconButton, Title } from "react-native-paper"

const Ladder = ({ navigation, route }) => {
    const { customer } = route.params
    return (
        <View style={styles.container}>
            <View style={styles.top}>
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Avatar.Text size={56} label={customer.name.charAt(0)} />
                </View>
                <View
                    style={{
                        flex: 4,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Title>{customer.name}</Title>
                        <IconButton
                            icon="information"
                            size={20}
                            color="grey"
                            onPress={() =>
                                alert(
                                    "Blue: Transactions\nGreen: Payments\nGrey: Deleted"
                                )
                            }
                        />
                    </View>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: "row",
                        }}
                    >
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text>Fine Silver</Text>
                            <Title>
                                {Math.round(customer.fineWeight).toString()}
                            </Title>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text>Cash</Text>
                            <Title>{customer.cash}</Title>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text>Labour</Text>
                            <Title>{customer.labour}</Title>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ flex: 6 }}>
                <ScrollView>
                    {customer.ladder.length ? (
                        customer.ladder
                            .sort((a, b) => b.lDate.toDate() - a.lDate.toDate())
                            .map((item) => <Item key={item.id} item={item} />)
                    ) : (
                        <View
                            style={{
                                height: 500,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "#000000aa" }}>
                                First add a transaction/payment
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </View>
    )
}

export default Ladder

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    top: {
        flex: 1,
        backgroundColor: "#fca311",
        flexDirection: "row",
    },
})

const Item = ({ item, key }) => {
    return (
        <View
            key={key}
            style={[
                { flexDirection: "row", paddingLeft: 16, paddingVertical: 4 },
                item.type === "transaction"
                    ? { backgroundColor: "lightblue" }
                    : item.type === "delete"
                    ? { backgroundColor: "grey" }
                    : { backgroundColor: "#BCED91" },
            ]}
        >
            <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12 }}>
                    {item.lDate.toDate().toString().substr(4, 17)}
                </Text>
            </View>
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text>{item.lFine ? item.lFine : "_"}</Text>
            </View>
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text>{item.lCash ? item.lCash : "_"}</Text>
            </View>
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Text>{item.lLabour ? item.lLabour : "_"}</Text>
            </View>
        </View>
    )
}
