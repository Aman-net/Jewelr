import React, { useContext, useEffect, useState } from "react"
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    FlatList,
    Alert,
} from "react-native"
import { Searchbar, FAB } from "react-native-paper"
import CustomerCard from "./customerCard"
import { AuthContext } from "../main"
import { firebase } from "../firebase/config"
import Loading from "../userlogin/loading"

const customerHome = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("")
    const [customerList, setCustomerList] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    const user = useContext(AuthContext)
    const onChangeSearch = (query) => setSearchQuery(query)

    useEffect(() => {
        var unsuscribe = firebase
            .firestore()
            .collection("users")
            .doc(user.id)
            .collection("customers")
            .orderBy("lastUpdated", "desc")
            .where("active", "==", true)
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === "added") {
                        const cus = { id: change.doc.id, ...change.doc.data() }
                        setCustomerList((prevState) => {
                            return [...prevState, cus]
                        })
                    }
                    if (change.type === "modified") {
                        const cus = { id: change.doc.id, ...change.doc.data() }
                        setCustomerList((prevState) => {
                            var newList = [...prevState]
                            newList = newList.filter(
                                (item) => item.id !== change.doc.id
                            )
                            return [cus, ...newList]
                        })
                    }
                })
            }, setIsLoading(false))

        return () => unsuscribe()
    }, [])

    const movetodetails = (value) =>
        navigation.navigate("Details", { customerValue: value })

    const disableCustomer = (id) => {
        Alert.alert(
            "Disable Customer",
            "This will remove the customer, are you sure?",
            [
                {
                    text: "cancel",
                    style: "cancel",
                },
                {
                    text: "ok",
                    onPress: () => (
                        firebase
                            .firestore()
                            .collection("users")
                            .doc(user.id)
                            .collection("customers")
                            .doc(id)
                            .update({
                                active: false,
                            }),
                        setCustomerList((prevState) => {
                            var newList = [...prevState]
                            newList = newList.filter((item) => item.id !== id)
                            return [...newList]
                        })
                    ),
                },
            ]
        )
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#e5e5e5" }}>
            <View style={styles.oval} />
            <Searchbar
                style={styles.search}
                onChangeText={onChangeSearch}
                placeholder="Search"
                value={searchQuery}
            />
            <SearchCustomer
                searchQuery={searchQuery}
                customerList={customerList}
                movetodetails={movetodetails}
            />
            {isLoading ? (
                <View style={{ flex: 1 }}>
                    <Loading />
                </View>
            ) : searchQuery ? null : (
                <ScrollView fadingEdgeLength={56} style={{ marginTop: -36 }}>
                    <View style={{ height: 30 }}></View>
                    {customerList.length ? (
                        customerList.map((item) => (
                            <CustomerCard
                                key={item.id}
                                value={item}
                                movetodetails={movetodetails}
                                disableCustomer={disableCustomer}
                            />
                        ))
                    ) : (
                        <View
                            style={{
                                height: 500,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "#000000aa" }}>
                                Tap on + button to add a new customer
                            </Text>
                        </View>
                    )}
                    <View style={{ height: 50 }}></View>
                </ScrollView>
            )}
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => navigation.navigate("NewCustomer")}
            />
        </View>
    )
}

export default customerHome

const styles = StyleSheet.create({
    search: {
        marginTop: 16,
        marginHorizontal: 16,
        marginBottom: 10,
        borderRadius: 50,
        elevation: 24,
        zIndex: 1,
        backgroundColor: "#fca311",
    },
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: 16,
        elevation: 8,
    },
    oval: {
        zIndex: -1,
        backgroundColor: "#14213d",
        height: 200,
        width: 200,
        borderRadius: 100,
        marginBottom: -160,
        marginTop: -40,
        alignSelf: "center",
        transform: [{ scaleX: 2.5 }],
    },
})

const SearchCustomer = ({ searchQuery, customerList, movetodetails }) => {
    if (searchQuery) {
        const filtered = customerList.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        return (
            <ScrollView style={{ marginTop: -36 }}>
                <View style={{ height: 30 }}></View>
                {filtered.map((item) => (
                    <CustomerCard
                        key={item.id}
                        value={item}
                        movetodetails={movetodetails}
                    />
                ))}
                <View style={{ height: 50 }}></View>
            </ScrollView>
        )
    } else {
        return null
    }
}
