import React, { useState, useEffect, useContext } from "react"
import { View, Text, StyleSheet } from "react-native"
import { Avatar, Title, Chip } from "react-native-paper"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs"
import Transactions from "./transactions"
import Payments from "./payments"
import { firebase } from "../firebase/config"
import { AuthContext } from "../main"

const Tab = createMaterialTopTabNavigator()

const navContext = React.createContext()

const CustomerDetails = ({ route, navigation }) => {
    const [newCustomer, setNewCustomer] = useState({})
    const { customerValue } = route.params
    const user = useContext(AuthContext)

    useEffect(() => {
        const unsuscribe = firebase
            .firestore()
            .collection("users")
            .doc(user.id)
            .collection("customers")
            .doc(customerValue.id)
            .onSnapshot((doc) => {
                setNewCustomer({ id: doc.id, ...doc.data() })
            })
        return () => unsuscribe()
    }, [])

    return (
        <View style={styles.container}>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    backgroundColor: "#fca311",
                    borderBottomLeftRadius: 32,
                    borderBottomRightRadius: 32,
                    paddingBottom: 24,
                    marginBottom: -24,
                }}
            >
                <View
                    style={{
                        justifyContent: "center",
                        flex: 2,
                        alignItems: "center",
                    }}
                >
                    <Avatar.Text
                        size={56}
                        label={customerValue.name.charAt(0)}
                    />
                </View>
                <View style={{ flex: 7 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Title>{customerValue.name}</Title>
                        <Chip
                            style={{
                                marginRight: 16,
                                marginTop: 8,
                                elevation: 12,
                            }}
                            onPress={() =>
                                navigation.navigate("Ladder", {
                                    customer: newCustomer,
                                })
                            }
                        >
                            Show
                        </Chip>
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
                                {Math.round(newCustomer.fineWeight).toString()}
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
                            <Title>{newCustomer.cash}</Title>
                        </View>
                        <View
                            style={{
                                flex: 1,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <Text>Labour</Text>
                            <Title>{newCustomer.labour}</Title>
                        </View>
                    </View>
                </View>
            </View>
            <View style={{ flex: 5 }}>
                <navContext.Provider
                    value={{
                        navigation: navigation,
                        customerValue: customerValue,
                    }}
                >
                    <Tab.Navigator
                        initialRouteName="Transactions"
                        tabBarOptions={{
                            activeTintColor: "#14213d",
                            indicatorStyle: {
                                backgroundColor: "#fca311",
                                height: 4,
                                borderRadius: 50,
                                width: 120,
                                marginStart: 30,
                                marginBottom: 8,
                                elevation: 4,
                            },
                            style: {
                                marginHorizontal: 16,
                                borderRadius: 50,
                                elevation: 12,
                                marginBottom: -24,
                            },
                        }}
                    >
                        <Tab.Screen
                            name="Transactions"
                            component={Transactions}
                        />
                        <Tab.Screen name="Payments" component={Payments} />
                    </Tab.Navigator>
                </navContext.Provider>
            </View>
        </View>
    )
}

export default CustomerDetails

export { navContext }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e5e5e5",
    },
})
