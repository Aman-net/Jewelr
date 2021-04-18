import React, { useContext, useEffect, useRef, useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { DataTable, Card, Button, IconButton, Title } from "react-native-paper"
import { firebase } from "../firebase/config"
import { AuthContext } from "../main"
import { captureRef } from "react-native-view-shot"
import * as Sharing from "expo-sharing"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const NewBill = ({ navigation, route }) => {
    const { customer, paymentList } = route.params
    const [newPayList, setNewPayList] = useState([])
    const [transDoc, setTransDoc] = useState({})
    const [stage1, setStage1] = useState(true)
    const user = useContext(AuthContext)
    const [newCustomer, setNewCustomer] = useState({})

    const refScreen = useRef(null)

    useEffect(() => {
        firebase
            .firestore()
            .collection("users")
            .doc(user.id)
            .collection("customers")
            .doc(customer.id)
            .collection("transactions")
            .orderBy("createdAt", "desc")
            .limit(1)
            .get()
            .then((doc) => {
                doc.forEach((doc) => setTransDoc(doc.data()))
            })

        firebase
            .firestore()
            .collection("users")
            .doc(user.id)
            .collection("customers")
            .doc(customer.id)
            .get()
            .then((doc) => setNewCustomer({ id: doc.id, ...doc.data() }))
    }, [])

    useEffect(() => {
        paymentList.forEach((item) => {
            const obj = { selected: false, ...item }
            setNewPayList((prevState) => [...prevState, obj])
        })
    }, [])

    const handleShare = () => {
        captureRef(refScreen, { format: "jpg", quality: 1 }).then(
            (uri) => {
                Sharing.shareAsync(uri, {
                    dialogTitle: "Share Bill",
                    mimeType: "image/jpg",
                })
            },
            (error) => console.error("Oops, snapshot failed", error)
        )
    }

    const handleSelect = (id) => {
        var list = [...newPayList]
        const index = list.findIndex((item) => item.id === id)
        list[index].selected = !list[index].selected
        setNewPayList(list)
    }

    const filterList = () => {
        return newPayList.filter((item) => item.selected === true)
    }

    const bFine = () => {
        let fine = Math.round(newCustomer.fineWeight)
        let payfine = 0
        filterList().forEach((pay) => {
            if (pay.type === "Silver") {
                payfine = payfine + pay.fineWeight
            }
            if (pay.type === "Bhav") {
                payfine = payfine + pay.fineBhav
            }
        })
        fine = fine - transDoc.tFine + payfine
        return Math.round(fine)
    }
    const bCash = () => {
        let money = newCustomer.cash
        let payCash = 0
        filterList().forEach((pay) => {
            if (pay.type === "Cash") {
                payCash += pay.cash
            }
            if (pay.type === "Bhav") {
                payCash -= pay.cash
            }
        })
        money = money - payCash
        return money
    }
    const bLabour = () => {
        let lab = newCustomer.labour
        let payLab = 0
        filterList().forEach((pay) => {
            if (pay.type === "Labour") {
                payLab += pay.cash
            }
        })
        lab = lab + payLab - transDoc.tLabour
        return lab
    }

    return (
        <View style={{ flex: 1, backgroundColor: "#e5e5e5" }}>
            {stage1 ? (
                <>
                    <View
                        style={{
                            padding: 16,
                            backgroundColor: "#fca311",
                            borderBottomEndRadius: 24,
                            borderBottomStartRadius: 24,
                        }}
                    >
                        <Text style={{ fontSize: 24, fontWeight: "700" }}>
                            {customer.name}
                        </Text>
                        <Text>Select payments to include in the bill</Text>
                    </View>

                    <ScrollView fadingEdgeLength={16} style={{ flex: 2 }}>
                        {Boolean(newPayList.length) ? (
                            newPayList.map((item) => (
                                <PaymentCard
                                    pinfo={item}
                                    key={item.id}
                                    handleSelect={handleSelect}
                                />
                            ))
                        ) : (
                            <View
                                style={{
                                    height: 300,
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Text>No Payments yet.</Text>
                                <Text />
                                <Text>Go back and add some or</Text>
                                <Text>click on NEXT to proceed.</Text>
                            </View>
                        )}
                    </ScrollView>
                    <View style={{ padding: 16 }}>
                        <Button
                            onPress={() => setStage1(false)}
                            mode="contained"
                        >
                            Next
                        </Button>
                    </View>
                </>
            ) : (
                <ScrollView>
                    <IconButton
                        style={styles.backButton}
                        icon="arrow-left"
                        size={32}
                        onPress={() => setStage1(true)}
                    />
                    <IconButton
                        style={styles.share}
                        icon="share-variant"
                        size={32}
                        onPress={() => handleShare()}
                    />
                    <View
                        style={{ backgroundColor: "#e5e5e5" }}
                        ref={refScreen}
                    >
                        <View style={styles.top}>
                            <Text
                                style={{
                                    alignSelf: "center",
                                    fontWeight: "bold",
                                    fontSize: 18,
                                    color: "#fca311",
                                }}
                            >
                                {user.fullname}
                            </Text>
                            <Text
                                style={{
                                    margin: 16,
                                    fontSize: 20,
                                    alignSelf: "flex-end",
                                    color: "white",
                                }}
                            >
                                {customer.name}
                            </Text>
                        </View>
                        <Text
                            style={{
                                alignSelf: "center",
                                marginTop: 8,
                                color: "grey",
                            }}
                        >
                            -- Initial --
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                            <View style={styles.topTotal}>
                                <Text>Fine</Text>
                                <Text
                                    style={{ fontSize: 20, fontWeight: "bold" }}
                                >
                                    {bFine()}
                                </Text>
                            </View>
                            <View style={styles.topTotal}>
                                <Text>Cash</Text>
                                <Text
                                    style={{ fontSize: 20, fontWeight: "bold" }}
                                >
                                    {bCash()}
                                </Text>
                            </View>
                            <View style={styles.topTotal}>
                                <Text>Labour</Text>
                                <Text
                                    style={{ fontSize: 20, fontWeight: "bold" }}
                                >
                                    {bLabour()}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Title style={styles.title}>Transactions</Title>
                            <Text
                                style={{
                                    color: "grey",
                                    fontSize: 12,
                                    marginRight: 8,
                                }}
                            >
                                {transDoc.createdAt
                                    .toDate()
                                    .toString()
                                    .substr(0, 21)}
                            </Text>
                        </View>

                        <DataTable style={styles.table}>
                            <DataTable.Header
                                style={{ backgroundColor: "#fca31160" }}
                            >
                                <DataTable.Title> Item </DataTable.Title>
                                <DataTable.Title numeric>
                                    Weight(g)
                                </DataTable.Title>
                                <DataTable.Title numeric>
                                    Fine(%)
                                </DataTable.Title>
                                <DataTable.Title numeric>
                                    Fine-W
                                </DataTable.Title>
                                <DataTable.Title numeric>
                                    Labour
                                </DataTable.Title>
                                <DataTable.Title numeric>
                                    T-Labour
                                </DataTable.Title>
                            </DataTable.Header>

                            {transDoc &&
                                transDoc.tItems.map((transItem) => {
                                    return (
                                        <DataTable.Row
                                            style={{
                                                marginHorizontal: 8,
                                                borderBottomColor: "#fca311",
                                                borderBottomWidth: 2,
                                            }}
                                            key={transItem.id}
                                        >
                                            <DataTable.Cell>
                                                {transItem.itemname}
                                            </DataTable.Cell>
                                            <DataTable.Cell numeric>
                                                {transItem.weight}
                                            </DataTable.Cell>
                                            <DataTable.Cell numeric>
                                                {transItem.fine}
                                            </DataTable.Cell>
                                            <DataTable.Cell numeric>
                                                {transItem.fineWeight}
                                            </DataTable.Cell>
                                            <DataTable.Cell numeric>
                                                {transItem.labour}
                                            </DataTable.Cell>
                                            <DataTable.Cell numeric>
                                                {transItem.labourTotal}
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    )
                                })}
                        </DataTable>
                        {Boolean(filterList().length) && (
                            <>
                                <Title style={styles.title}>Payments</Title>
                                <DataTable style={styles.table}>
                                    <DataTable.Header
                                        style={{ backgroundColor: "#fca31160" }}
                                    >
                                        <DataTable.Title>
                                            {" "}
                                            Type{" "}
                                        </DataTable.Title>
                                        <DataTable.Title numeric>
                                            Fine-W
                                        </DataTable.Title>
                                        <DataTable.Title numeric>
                                            Cash
                                        </DataTable.Title>
                                        <DataTable.Title numeric>
                                            Labour
                                        </DataTable.Title>
                                    </DataTable.Header>

                                    {filterList()
                                        .reverse()
                                        .map((item) => {
                                            return (
                                                <DataTable.Row
                                                    style={{
                                                        paddingHorizontal: 18,
                                                        borderBottomColor:
                                                            "#fca311",
                                                        borderBottomWidth: 2,
                                                        backgroundColor:
                                                            "lightgreen",
                                                    }}
                                                    key={item.id}
                                                >
                                                    <DataTable.Cell>
                                                        {item.type}
                                                    </DataTable.Cell>
                                                    <DataTable.Cell numeric>
                                                        {item.fineWeight
                                                            ? item.fineWeight.toString()
                                                            : item.fineBhav
                                                            ? item.fineBhav.toString()
                                                            : "_"}
                                                    </DataTable.Cell>
                                                    {item.silverPrice && (
                                                        <DataTable.Cell>
                                                            {" (" +
                                                                parseFloat(
                                                                    item.silverPrice /
                                                                        1000
                                                                ).toString() +
                                                                ")"}
                                                        </DataTable.Cell>
                                                    )}
                                                    <DataTable.Cell numeric>
                                                        {item.type === "Cash"
                                                            ? item.cash.toString()
                                                            : item.type ===
                                                              "Bhav"
                                                            ? item.cash.toString()
                                                            : "_"}
                                                    </DataTable.Cell>
                                                    <DataTable.Cell numeric>
                                                        {item.type === "Labour"
                                                            ? item.cash.toString()
                                                            : "_"}
                                                    </DataTable.Cell>
                                                </DataTable.Row>
                                            )
                                        })}
                                </DataTable>
                            </>
                        )}
                        <Text
                            style={{
                                alignSelf: "center",
                                marginTop: 8,
                                color: "grey",
                            }}
                        >
                            -- Final --
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                            <View style={styles.bottomTotal}>
                                <Text>Fine</Text>
                                <Text
                                    style={{ fontSize: 20, fontWeight: "bold" }}
                                >
                                    {Math.round(newCustomer.fineWeight)}
                                </Text>
                            </View>
                            <View style={styles.bottomTotal}>
                                <Text>Cash</Text>
                                <Text
                                    style={{ fontSize: 20, fontWeight: "bold" }}
                                >
                                    {newCustomer.cash}
                                </Text>
                            </View>
                            <View style={styles.bottomTotal}>
                                <Text>Labour</Text>
                                <Text
                                    style={{ fontSize: 20, fontWeight: "bold" }}
                                >
                                    {newCustomer.labour}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignSelf: "center",
                                marginVertical: 16,
                            }}
                        >
                            <Text> Made with </Text>
                            <MaterialCommunityIcons
                                name="heart"
                                size={24}
                                color="red"
                            />
                            <Text> by Aman</Text>
                        </View>

                        {/* {filterList().map((item) => (
                            <PaymentCard
                                pinfo={item}
                                key={item.id}
                                handleSelect={() => null}
                            />
                        ))} */}
                    </View>
                </ScrollView>
            )}
        </View>
    )
}

export default NewBill

const styles = StyleSheet.create({
    table: {
        backgroundColor: "#fff",
    },
    card: {
        marginTop: 8,
        marginHorizontal: 16,
    },
    backButton: {
        position: "absolute",
        top: 0,
        left: 0,
        margin: 16,
        backgroundColor: "white",
        zIndex: 1,
    },
    share: {
        position: "absolute",
        right: 0,
        top: 0,
        margin: 16,
        zIndex: 1,
        backgroundColor: "#fca311",
    },
    title: {
        marginLeft: 12,
        padding: 4,
    },
    bottomTotal: {
        flex: 1,
        alignItems: "center",
        margin: 8,
        backgroundColor: "#fca311aa",
        borderRadius: 16,
        paddingVertical: 4,
    },
    topTotal: {
        flex: 1,
        alignItems: "center",
        margin: 8,
        backgroundColor: "#fca31180",
        borderRadius: 16,
        paddingVertical: 4,
    },
    top: {
        backgroundColor: "#14213d",
        paddingTop: 28,
        borderBottomStartRadius: 24,
        borderBottomEndRadius: 24,
        elevation: 16,
    },
})

const PaymentCard = ({ pinfo, handleSelect }) => {
    return (
        <Card
            onPress={() => handleSelect(pinfo.id)}
            style={[
                styles.card,
                pinfo.selected && { backgroundColor: "lightgreen" },
            ]}
        >
            <Card.Title
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
        </Card>
    )
}
