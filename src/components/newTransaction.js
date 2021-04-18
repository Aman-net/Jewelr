import React, { useContext, useEffect, useState } from "react"
import { Alert, StyleSheet, Text, View } from "react-native"
import { Button, DataTable, TextInput, Title } from "react-native-paper"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { firebase } from "../firebase/config"
import { AuthContext } from "../main"

const NewTransaction = ({ navigation, route }) => {
    const [itemname, setItemname] = useState("")
    const [weight, setWeight] = useState("")
    const [fine, setFine] = useState("")
    const [labour, setLabour] = useState("")

    const user = useContext(AuthContext)
    const { customer } = route.params
    const [counter, setCounter] = useState(1)
    const [dataList, setDataList] = useState([])
    const [transFine, setTransFine] = useState(0)
    const [transLabour, setTransLabour] = useState(0)
    const [saved, setSaved] = useState(false)

    useEffect(() => {
        const unsuscribe = navigation.addListener("beforeRemove", (e) => {
            if (saved || dataList.length === 0) {
                return
            } else {
                e.preventDefault()
                Alert.alert(
                    "Discard Transaction",
                    "You have not submitted Transaction. Are you sure to delete it? if not, then SUBMIT the transaction.",
                    [
                        { text: "Don't Leave", style: "cancel" },
                        {
                            text: "Discard",
                            style: "destructive",
                            onPress: () => navigation.dispatch(e.data.action),
                        },
                    ]
                )
            }
        })
        return unsuscribe
    }, [navigation, saved, dataList])

    const userRef = firebase
        .firestore()
        .collection("users")
        .doc(user.id)
        .collection("customers")
        .doc(customer.id)

    const setZero = () => {
        setItemname("")
        setWeight("")
        setFine("")
        setLabour("")
    }

    const handleAdd = () => {
        if (!itemname || !weight || !fine || !labour) {
            alert("Please fill all the fields.")
        } else {
            var labourTotal = (
                (parseFloat(weight) / 1000) *
                parseFloat(labour)
            ).toFixed(0)

            var fineWeight = (
                (parseFloat(fine) * parseFloat(weight)) /
                100
            ).toFixed(1)
            const transItem = {
                id: counter,
                itemname: itemname,
                weight: parseFloat(weight),
                fine: parseFloat(fine),
                labour: parseInt(labour),
                labourTotal: parseInt(labourTotal),
                fineWeight: parseFloat(fineWeight),
            }
            setDataList((prevState) => [...prevState, transItem])
            setCounter((prevState) => prevState + 1)
            setTransFine((prevState) => prevState + parseFloat(fineWeight))
            setTransLabour((prevState) => prevState + parseInt(labourTotal))
            setZero()
        }
    }
    const handleDelete = (transItem) => {
        Alert.alert("Delete Item", "Are you sure to delete this?", [
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "OK",
                onPress: () => {
                    setDataList((prevState) =>
                        prevState.filter((item) => item.id !== transItem.id)
                    )
                    setTransFine(
                        (prevState) =>
                            prevState - parseFloat(transItem.fineWeight)
                    )
                    setTransLabour(
                        (prevState) =>
                            prevState - parseFloat(transItem.labourTotal)
                    )
                },
            },
        ])
    }

    const handleTransAdd = () => {
        setSaved(true)
        Alert.alert(
            "Confirm Submit",
            "Total fine: " +
                Math.round(transFine).toString() +
                "\nTotal labour: " +
                transLabour.toString(),
            [
                {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => setSaved(false),
                },
                {
                    text: "Confirm",
                    onPress: () => {
                        userRef.collection("transactions").add({
                            createdAt: firebase.firestore.Timestamp.now(),
                            tFine: Math.round(transFine),
                            tLabour: transLabour,
                            tItems: dataList,
                            userId: user.id,
                            customerId: customer.id,
                            customerName: customer.name,
                        })

                        const ladderItem = {
                            lFine: Math.round(transFine),
                            lLabour: transLabour,
                            lDate: firebase.firestore.Timestamp.now(),
                            type: "transaction",
                        }

                        userRef.update({
                            fineWeight: firebase.firestore.FieldValue.increment(
                                Math.round(transFine)
                            ),
                            labour: firebase.firestore.FieldValue.increment(
                                transLabour
                            ),
                            ladder: firebase.firestore.FieldValue.arrayUnion(
                                ladderItem
                            ),
                            lastUpdated: firebase.firestore.Timestamp.now(),
                        })
                        navigation.navigate("Details")
                    },
                },
            ]
        )
    }

    return (
        <KeyboardAwareScrollView
            style={{ backgroundColor: "#e5e5e5" }}
            enableOnAndroid={true}
            enableAutomaticScroll={true}
        >
            <View style={{ alignItems: "center" }}>
                <View
                    style={{
                        backgroundColor: "#fca31160",
                        width: "100%",
                        paddingBottom: 40,
                        marginBottom: -32,
                        borderBottomLeftRadius: 32,
                        borderBottomRightRadius: 32,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 8,
                        }}
                    >
                        <TextInput
                            style={{
                                flex: 1,
                                marginLeft: 16,
                                marginRight: 6,
                            }}
                            right={<TextInput.Icon name="card-text" />}
                            mode="outlined"
                            label="Item Name"
                            value={itemname}
                            onChangeText={(value) => setItemname(value)}
                        />

                        <TextInput
                            style={{
                                flex: 1,
                                marginRight: 16,
                                marginLeft: 6,
                            }}
                            right={<TextInput.Icon name="weight-gram" />}
                            mode="outlined"
                            label="Weight"
                            value={weight}
                            onChangeText={(value) => setWeight(value)}
                            keyboardType="numeric"
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 8,
                        }}
                    >
                        <TextInput
                            style={{ flex: 1, marginLeft: 16, marginRight: 6 }}
                            right={<TextInput.Icon name="percent" />}
                            mode="outlined"
                            label="Fine"
                            value={fine}
                            onChangeText={(value) => setFine(value)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={{ flex: 1, marginRight: 16, marginLeft: 6 }}
                            right={<TextInput.Icon name="weight-kilogram" />}
                            mode="outlined"
                            label="Labour"
                            value={labour}
                            onChangeText={(value) => setLabour(value)}
                            keyboardType="numeric"
                        />
                    </View>
                </View>
                <Button
                    style={styles.addbtn}
                    icon="plus-circle-outline"
                    labelStyle={{ color: "#fca311", fontSize: 16 }}
                    mode="contained"
                    onPress={() => handleAdd()}
                >
                    Add
                </Button>
                <View
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-evenly",
                    }}
                >
                    <Button
                        style={{
                            backgroundColor: "#fca311",
                            width: "35%",
                            elevation: 8,
                        }}
                        labelStyle={{
                            color: "#14213d",
                            fontWeight: "bold",
                            fontSize: 18,
                        }}
                        mode="contained"
                        onPress={() => handleTransAdd()}
                    >
                        Submit
                    </Button>
                </View>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                }}
            >
                <View style={styles.total}>
                    <Text style={{ fontSize: 12, color: "grey" }}>
                        Total Fine(g)
                    </Text>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                        {Math.round(transFine)}
                    </Text>
                </View>
                <View style={styles.total}>
                    <Text style={{ fontSize: 12, color: "grey" }}>
                        Total Labour(Rs)
                    </Text>
                    <Text style={{ fontSize: 24, fontWeight: "bold" }}>
                        {transLabour}
                    </Text>
                </View>
            </View>
            <View
                style={{
                    backgroundColor: "#fca31160",
                    borderRadius: 24,
                    marginTop: 8,
                }}
            >
                <DataTable>
                    <DataTable.Header>
                        <DataTable.Title>Item</DataTable.Title>
                        <DataTable.Title numeric>Weight(g)</DataTable.Title>
                        <DataTable.Title numeric>%</DataTable.Title>
                        <DataTable.Title numeric>Fine-W</DataTable.Title>
                        <DataTable.Title numeric>Labour</DataTable.Title>
                        <DataTable.Title numeric>T-Lab.</DataTable.Title>
                    </DataTable.Header>
                    {dataList.map((transItem) => {
                        return (
                            <DataTable.Row
                                style={{
                                    backgroundColor: "white",
                                    borderBottomWidth: 2,
                                    borderBottomColor: "#fca311",
                                }}
                                key={transItem.id}
                                onPress={() => handleDelete(transItem)}
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
            </View>
        </KeyboardAwareScrollView>
    )
}

export default NewTransaction

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e5e5e5",
    },
    addbtn: {
        margin: 8,
        borderRadius: 50,
        width: "92%",
        paddingVertical: 4,
    },
    total: {
        height: 64,
        width: 136,
        backgroundColor: "white",
        alignItems: "center",
        margin: 8,
        borderRadius: 24,
        justifyContent: "center",
        elevation: 8,
    },
})
