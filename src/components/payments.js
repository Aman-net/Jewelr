import React, { useContext, useEffect, useState } from "react"
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native"
import { navContext } from "./customerDetails"
import { Button, Card, FAB } from "react-native-paper"
import { firebase } from "../firebase/config"
import { AuthContext } from "../main"

const Payments = () => {
    const { navigation, customerValue } = useContext(navContext)
    const user = useContext(AuthContext)
    const [listeners, setListeners] = useState([])
    const [start, setStart] = useState(null)
    const [isEnd, setIsEnd] = useState(false)

    const [paymentList, setPaymentList] = useState([])

    const refDb = firebase
        .firestore()
        .collection("users")
        .doc(user.id)
        .collection("customers")
        .doc(customerValue.id)
        .collection("payments")

    const refCus = firebase
        .firestore()
        .collection("users")
        .doc(user.id)
        .collection("customers")
        .doc(customerValue.id)

    const deletePayment = (pinfo) => {
        Alert.alert("Delete Payment", "Are you sure?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Ok",
                onPress: () =>
                    refDb.doc(pinfo.id).delete().then(afterMathDelete(pinfo)),
            },
        ])
    }
    const afterMathDelete = (pinfo) => {
        switch (pinfo.type) {
            case "Silver":
                refCus.update({
                    fineWeight: firebase.firestore.FieldValue.increment(
                        pinfo.fineWeight
                    ),
                    ladder: firebase.firestore.FieldValue.arrayUnion({
                        lFine: pinfo.fineWeight,
                        lDate: firebase.firestore.Timestamp.now(),
                        type: "delete",
                    }),
                    lastUpdated: firebase.firestore.Timestamp.now(),
                })
                break

            case "Labour":
                refCus.update({
                    labour: firebase.firestore.FieldValue.increment(pinfo.cash),
                    ladder: firebase.firestore.FieldValue.arrayUnion({
                        lLabour: pinfo.cash,
                        lDate: firebase.firestore.Timestamp.now(),
                        type: "delete",
                    }),
                    lastUpdated: firebase.firestore.Timestamp.now(),
                })
                break

            case "Bhav":
                refCus.update({
                    fineWeight: firebase.firestore.FieldValue.increment(
                        pinfo.fineBhav
                    ),
                    cash: firebase.firestore.FieldValue.increment(pinfo.cash),
                    ladder: firebase.firestore.FieldValue.arrayUnion({
                        lFine: pinfo.fineBhav,
                        lCash: pinfo.cash,
                        lDate: firebase.firestore.Timestamp.now(),
                        type: "delete",
                    }),
                    lastUpdated: firebase.firestore.Timestamp.now(),
                })
                break
            case "Cash":
                refCus.update({
                    cash: firebase.firestore.FieldValue.increment(-pinfo.cash),
                    ladder: firebase.firestore.FieldValue.arrayUnion({
                        lCash: pinfo.cash,
                        lDate: firebase.firestore.Timestamp.now(),
                        type: "delete",
                    }),
                    lastUpdated: firebase.firestore.Timestamp.now(),
                })
                break

            default:
                break
        }
    }

    const getPays = () => {
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
                            trans.docChanges().forEach((change) => {
                                if (change.type === "added") {
                                    setPaymentList((prevState) => [
                                        {
                                            id: change.doc.id,
                                            ...change.doc.data(),
                                        },
                                        ...prevState,
                                    ])
                                }
                                if (change.type === "removed") {
                                    setPaymentList((prevState) =>
                                        prevState.filter(
                                            (item) => item.id !== change.doc.id
                                        )
                                    )
                                }
                            })
                        })

                    setListeners((prevState) => [...prevState, listener])
                }
            })
            .catch((error) => alert(error))
    }

    const getMorePays = () => {
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
                                setPaymentList((prevState) => [
                                    ...prevState,
                                    {
                                        id: change.doc.id,
                                        ...change.doc.data(),
                                    },
                                ])
                            }
                            if (change.type === "removed") {
                                setPaymentList((prevState) =>
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
        getPays()

        return () => {
            listeners.forEach((listener) => listener())
        }
    }, [])

    return (
        <View style={styles.container}>
            <ScrollView fadingEdgeLength={16}>
                <View style={{ height: 36 }} />
                {paymentList.length ? (
                    paymentList.map((item) => (
                        <PaymentCard
                            pinfo={item}
                            key={item.id}
                            deletePayment={deletePayment}
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
                            Tap on + button to add a new payment
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
                    {!isEnd && Boolean(paymentList.length) && (
                        <Button mode="text" onPress={() => getMorePays()}>
                            Load more
                        </Button>
                    )}
                </View>
            </ScrollView>

            <FAB
                style={styles.fab2}
                icon="cash-register"
                onPress={() =>
                    navigation.navigate("Bill", {
                        customer: customerValue,
                        paymentList: paymentList,
                    })
                }
            />

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() =>
                    navigation.navigate("New Payment", {
                        customer: customerValue,
                    })
                }
            />
        </View>
    )
}

export default Payments

const PaymentCard = ({ pinfo, deletePayment }) => {
    const [isVisible, setIsVisible] = useState(false)
    const toogleDelete = () => {
        setIsVisible(true)
        setTimeout(() => setIsVisible(false), 1500)
    }

    return (
        <Card onLongPress={() => toogleDelete()} style={styles.card}>
            <Card.Title
                titleStyle={{ fontSize: 18 }}
                title={pinfo.createdAt.toDate().toString().substr(0, 21)}
            />
            <Card.Content style={{ paddingBottom: 8 }}>
                <Text>{"Payment type: " + pinfo.type}</Text>
                {pinfo.fineWeight && (
                    <Text>Fine weight :{pinfo.fineWeight.toString()}</Text>
                )}
                {pinfo.silverPrice && (
                    <Text>Silver Price :{pinfo.silverPrice.toString()}</Text>
                )}
                {pinfo.fineBhav && (
                    <Text>Fine weight :{pinfo.fineBhav.toString()}</Text>
                )}
                {pinfo.cash && <Text>Cash :{pinfo.cash.toString()}</Text>}
            </Card.Content>
            {isVisible && (
                <View
                    style={{
                        height: 32,
                        backgroundColor: "red",
                        marginBottom: 8,
                        flex: 1,
                    }}
                >
                    <Button
                        onPress={() => deletePayment(pinfo)}
                        style={{ backgroundColor: "red" }}
                        mode="contained"
                    >
                        delete
                    </Button>
                </View>
            )}
        </Card>
    )
}

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
    card: {
        marginTop: 8,
        marginHorizontal: 16,
    },
    fab2: {
        position: "absolute",
        right: 0,
        bottom: 64,
        margin: 16,
        elevation: 8,
        backgroundColor: "green",
    },
})
