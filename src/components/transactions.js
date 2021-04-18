import React, { useContext, useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native"
import TransactionCard from "./transactionCard"
import { Button, FAB } from "react-native-paper"
import { navContext } from "./customerDetails"
import { AuthContext } from "../main"
import { firebase } from "../firebase/config"
import Loading from "../userlogin/loading"

const Transactions = () => {
    const { navigation, customerValue } = useContext(navContext)
    const [transList, setTransList] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [listeners, setListeners] = useState([])
    const [start, setStart] = useState(null)
    const user = useContext(AuthContext)
    const [isEnd, setIsEnd] = useState(false)

    const refDb = firebase
        .firestore()
        .collection("users")
        .doc(user.id)
        .collection("customers")
        .doc(customerValue.id)
        .collection("transactions")

    const getTrans = () => {
        refDb
            .orderBy("createdAt", "desc")
            .limit(8)
            .get()
            .then((snapshot) => {
                if (snapshot.docs.length) {
                    setStart(snapshot.docs[snapshot.docs.length - 1])
                    let startLocal = snapshot.docs[snapshot.docs.length - 1]

                    let listener = refDb
                        .orderBy("createdAt")
                        .startAt(startLocal)
                        .onSnapshot((trans) => {
                            setIsLoading(false)
                            trans.docChanges().forEach((change) => {
                                if (change.type === "added") {
                                    setTransList((prevState) => [
                                        {
                                            id: change.doc.id,
                                            ...change.doc.data(),
                                        },
                                        ...prevState,
                                    ])
                                }
                                if (change.type === "removed") {
                                    setTransList((prevState) =>
                                        prevState.filter(
                                            (item) => item.id !== change.doc.id
                                        )
                                    )
                                }
                            })
                        })

                    setListeners((prevState) => [...prevState, listener])
                } else {
                    setIsLoading(false)
                }
            })
            .catch((error) => alert(error))
    }

    const getMoreTrans = () => {
        refDb
            .orderBy("createdAt", "desc")
            .startAfter(start)
            .limit(8)
            .get()
            .then((snapshot) => {
                let startLocal = start
                let endLocal = snapshot.docs[snapshot.docs.length - 1]
                setStart(endLocal)
                let listener = refDb
                    .orderBy("createdAt", "desc")
                    .startAfter(startLocal)
                    .endAt(endLocal)
                    .onSnapshot((trans) => {
                        trans.docChanges().forEach((change) => {
                            if (change.type === "added") {
                                setTransList((prevState) => [
                                    ...prevState,
                                    {
                                        id: change.doc.id,
                                        ...change.doc.data(),
                                    },
                                ])
                            }
                            if (change.type === "removed") {
                                setTransList((prevState) =>
                                    prevState.filter(
                                        (item) => item.id !== change.doc.id
                                    )
                                )
                            }
                        })
                    })

                setListeners((prevState) => [...prevState, listener])
            })
            .catch((error) => (alert("End of the list."), setIsEnd(true)))
    }

    useEffect(() => {
        getTrans()

        return () => {
            listeners.forEach((listener) => listener())
        }
    }, [])

    const deleteTransaction = ({ id, tFine, tLabour }) => {
        const ref = firebase
            .firestore()
            .collection("users")
            .doc(user.id)
            .collection("customers")
            .doc(customerValue.id)

        Alert.alert("Delete Transaction", "Are you sure?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "Ok",
                onPress: () =>
                    ref
                        .collection("transactions")
                        .doc(id)
                        .delete()
                        .then(
                            ref.update({
                                fineWeight: firebase.firestore.FieldValue.increment(
                                    -tFine
                                ),
                                labour: firebase.firestore.FieldValue.increment(
                                    -tLabour
                                ),
                                ladder: firebase.firestore.FieldValue.arrayUnion(
                                    {
                                        lFine: tFine,
                                        lLabour: tLabour,
                                        lDate: firebase.firestore.Timestamp.now(),
                                        type: "delete",
                                    }
                                ),
                                lastUpdated: firebase.firestore.Timestamp.now(),
                            })
                        )
                        .catch((error) => alert(error)),
            },
        ])
    }

    return (
        <View style={styles.container}>
            {isLoading ? (
                <View style={styles.loading}>
                    <Loading />
                </View>
            ) : (
                <ScrollView fadingEdgeLength={16}>
                    <View style={{ height: 36 }} />
                    {transList.length ? (
                        transList.map((value) => (
                            <TransactionCard
                                key={value.id}
                                details={value}
                                deleteTransaction={deleteTransaction}
                                move={() => {
                                    navigation.navigate("Transaction Details", {
                                        details: value,
                                        customer: customerValue,
                                    })
                                }}
                            />
                        ))
                    ) : (
                        <View
                            style={{
                                height: 400,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ color: "#000000aa" }}>
                                Tap on + button to add a new transaction
                            </Text>
                        </View>
                    )}
                    <View
                        style={{
                            height: 64,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {!isEnd && Boolean(transList.length) && (
                            <Button mode="text" onPress={() => getMoreTrans()}>
                                Load more
                            </Button>
                        )}
                    </View>
                </ScrollView>
            )}

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() =>
                    navigation.navigate("New Transaction", {
                        customer: customerValue,
                    })
                }
            />
        </View>
    )
}

export default Transactions

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e5e5e5",
    },
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: 16,
        elevation: 8,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
})
