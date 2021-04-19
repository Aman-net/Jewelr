import React, { useContext, useEffect, useState } from "react"
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    ScrollView,
    Image,
} from "react-native"
import { Avatar, Button, Title } from "react-native-paper"
import { AuthContext, SetQ } from "../main"
import { firebase } from "../firebase/config"
import { setStatusBarBackgroundColor } from "expo-status-bar"

const HomeTab = ({ navigation }) => {
    const user = useContext(AuthContext)
    const setUser = useContext(SetQ)
    const [transList, setTransList] = useState([])
    const [payList, setPayList] = useState([])
    const [url, setUrl] = useState("")

    useEffect(() => {
        const unsuscribe = firebase
            .firestore()
            .collectionGroup("transactions")
            .where("userId", "==", user.id)
            .orderBy("createdAt", "desc")
            .limit(8)
            .onSnapshot(
                (querySnapshot) => {
                    setTransList([])
                    querySnapshot.forEach((item) =>
                        setTransList((prevState) => {
                            const obj = { id: item.id, ...item.data() }
                            return [...prevState, obj]
                        })
                    )
                },
                (error) => console.log(error)
            )
        return () => unsuscribe()
    }, [])

    useEffect(() => {
        if (user.profileUrl) {
            firebase
                .storage()
                .ref()
                .child(user.profileUrl.toString())
                .getDownloadURL()
                .then((url) => {
                    setUrl(url)
                })
        }

        const unsuscribe = firebase
            .firestore()
            .collectionGroup("payments")
            .where("userId", "==", user.id)
            .orderBy("createdAt", "desc")
            .limit(8)
            .onSnapshot(
                (querySnapshot) => {
                    setPayList([])
                    querySnapshot.forEach((item) => {
                        setPayList((prevState) => {
                            const obj = { id: item.id, ...item.data() }
                            return [...prevState, obj]
                        })
                    })
                },
                (error) => console.log(error)
            )
        return () => unsuscribe()
    }, [])

    const logoutpress = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                setUser(null)
            })
            .catch((error) => alert(error))
    }

    return (
        <View style={styles.container}>
            <StatusBar style={setStatusBarBackgroundColor("#14213d", true)} />
            <View style={styles.topContainer}>
                <View
                    style={{
                        flexDirection: "row",
                        marginLeft: 16,
                        marginTop: 8,
                        alignItems: "center",
                    }}
                >
                    <Image
                        style={{
                            width: 48,
                            height: 48,
                            resizeMode: "contain",
                            borderRadius: 200,
                        }}
                        source={require("../../assets/icon.png")}
                    />
                    <Image
                        style={{
                            width: 100,
                            height: 48,
                            resizeMode: "center",
                            marginLeft: 16,
                            top: 4,
                        }}
                        source={require("../../assets/logoPrimary.png")}
                    />
                </View>
                <View
                    style={{
                        justifyContent: "center",
                        alignSelf: "flex-end",
                        marginRight: 16,
                        flexDirection: "row",
                    }}
                >
                    <View
                        style={{
                            alignItems: "flex-end",
                            marginRight: 16,
                            justifyContent: "center",
                        }}
                    >
                        <Text style={styles.textWhite}>Hello,</Text>
                        <Text
                            style={[
                                styles.textWhite,
                                {
                                    fontSize: 18,
                                    fontWeight: "700",
                                },
                            ]}
                        >
                            {user.fullname}
                        </Text>
                    </View>
                    <Avatar.Image
                        size={96}
                        source={
                            user.profileUrl
                                ? { uri: url }
                                : require("../../assets/emptyprofile.png")
                        }
                    />
                </View>
            </View>
            <View style={styles.curve} />
            <View
                style={{
                    flex: 4,
                    marginTop: -80,
                }}
            >
                <Title
                    style={{
                        alignSelf: "flex-start",
                        marginLeft: 16,
                        color: "white",
                    }}
                >
                    Recent Transactions
                </Title>
                <ScrollView
                    style={{ flex: 1 }}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                >
                    {transList.map((item) => (
                        <TransCard item={item} />
                    ))}
                </ScrollView>

                <Title
                    style={{
                        alignSelf: "flex-start",
                        marginLeft: 16,
                        color: "black",
                    }}
                >
                    Recent Payments
                </Title>
                <ScrollView
                    style={{ flex: 1 }}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                >
                    {payList.map((item) => (
                        <PayCard item={item} />
                    ))}
                </ScrollView>

                <Button
                    style={{
                        width: 150,
                        margin: 16,
                        padding: 5,
                        alignSelf: "center",
                    }}
                    mode="contained"
                    onPress={() => logoutpress()}
                >
                    LogOut
                </Button>
            </View>
        </View>
    )
}

export default HomeTab

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fca311bb",
    },
    avatar: {
        flex: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    textWhite: {
        color: "#fff",
    },
    topContainer: {
        flex: 1,
        backgroundColor: "#14213d",
    },
    curve: {
        width: 200,
        height: 200,
        borderRadius: 100,
        zIndex: -1,
        marginTop: -100,
        transform: [{ scaleX: 2.5 }],
        backgroundColor: "#14213d",
        alignSelf: "center",
    },
    transCard: {
        width: 160,
        height: 180,
        backgroundColor: "white",
        margin: 8,
        elevation: 8,
        padding: 16,
        borderRadius: 16,
    },
    payCard: {
        width: 168,
        height: 180,
        backgroundColor: "white",
        margin: 8,
        elevation: 8,
        padding: 16,
        borderRadius: 16,
    },
})

const TransCard = ({ item }) => {
    return (
        <View key={item.id.toString()} style={styles.transCard}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {item.customerName}
            </Text>
            <Text style={{ fontSize: 10, marginTop: 2 }}>
                {item.createdAt.toDate().toString().substr(0, 21)}
            </Text>
            <View
                style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 12,
                }}
            >
                <Text style={{ fontSize: 12 }}>Total Weight</Text>
                <Text
                    style={{
                        alignSelf: "center",
                        fontSize: 18,
                    }}
                >
                    {item.tFine}
                </Text>
            </View>

            <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 12 }}>Total Labour</Text>
                <Text style={{ alignSelf: "center", fontSize: 18 }}>
                    {item.tLabour}
                </Text>
            </View>
        </View>
    )
}

const PayCard = ({ item }) => {
    return (
        <View key={item.id.toString()} style={styles.payCard}>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                {item.customerName}
            </Text>
            <Text style={{ fontSize: 10, marginTop: 2 }}>
                {item.createdAt.toDate().toString().substr(0, 21)}
            </Text>
            <Text style={{ marginTop: 8 }}>Type : {item.type}</Text>
            <View>
                {item.fineWeight && (
                    <Text>Fine Weight : {item.fineWeight}</Text>
                )}
                {item.cash && <Text>Cash : {item.cash}</Text>}
                {item.silverPrice && <Text>Price : {item.silverPrice}</Text>}
                {item.fineBhav && <Text>Fine Silver : {item.fineBhav}</Text>}
            </View>
        </View>
    )
}
