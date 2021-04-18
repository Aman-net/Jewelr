import React, { useContext, useState } from "react"
import {
    Alert,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    View,
} from "react-native"
import { Picker } from "@react-native-picker/picker"
import { firebase } from "../firebase/config"
import { AuthContext } from "../main"
import { Button, TextInput } from "react-native-paper"

const roundoff = (number) => {
    const a = number - Math.floor(number)
    if (a >= 0.7) {
        return Math.ceil(number)
    } else {
        return Math.floor(number)
    }
}

const NewPayment = ({ navigation, route }) => {
    const [type, setType] = useState("Cash")
    const [weight, setWeight] = useState("")
    const [fine, setFine] = useState("")
    const [cash, setCash] = useState("")
    const [silverPrice, setSilverPrice] = useState("")

    const { customer } = route.params
    const user = useContext(AuthContext)

    const userRef = firebase
        .firestore()
        .collection("users")
        .doc(user.id)
        .collection("customers")
        .doc(customer.id)

    const handlePay = () => {
        switch (type) {
            case "Silver": {
                if (!weight || !fine) {
                    alert("please fill the required fields.")
                    break
                }
                const mpay = {
                    type: type,
                    weight: parseFloat(weight),
                    fine: parseFloat(fine),
                    fineWeight: roundoff(
                        (parseFloat(weight) * parseFloat(fine)) / 100
                    ),
                    createdAt: firebase.firestore.Timestamp.now(),
                    userId: user.id,
                    customerId: customer.id,
                    customerName: customer.name,
                }
                Alert.alert(
                    "Confirm Payment",
                    "Weight: " +
                        mpay.weight.toString() +
                        "\n" +
                        "Fine(%): " +
                        mpay.fine.toString() +
                        "\n" +
                        "Fine Weight: " +
                        mpay.fineWeight.toString(),
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Confirm",
                            onPress: () => {
                                userRef.collection("payments").add(mpay)
                                userRef.update({
                                    fineWeight: firebase.firestore.FieldValue.increment(
                                        -mpay.fineWeight
                                    ),
                                    ladder: firebase.firestore.FieldValue.arrayUnion(
                                        {
                                            lFine: mpay.fineWeight,
                                            lDate: firebase.firestore.Timestamp.now(),
                                            type: "payment",
                                        }
                                    ),
                                    lastUpdated: firebase.firestore.Timestamp.now(),
                                })
                                navigation.navigate("Details")
                            },
                        },
                    ]
                )
                break
            }
            case "Cash": {
                if (!cash) {
                    alert("please fill the required fields.")
                    break
                }
                const mpay = {
                    type: type,
                    cash: parseInt(cash),
                    createdAt: firebase.firestore.Timestamp.now(),
                    userId: user.id,
                    customerId: customer.id,
                    customerName: customer.name,
                }
                Alert.alert(
                    "Confirm Payment",
                    "Cash: " + mpay.cash.toString(),
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Confirm",
                            onPress: () => {
                                userRef.collection("payments").add(mpay)
                                userRef.update({
                                    cash: firebase.firestore.FieldValue.increment(
                                        mpay.cash
                                    ),
                                    ladder: firebase.firestore.FieldValue.arrayUnion(
                                        {
                                            lCash: mpay.cash,
                                            lDate: firebase.firestore.Timestamp.now(),
                                            type: "payment",
                                        }
                                    ),
                                    lastUpdated: firebase.firestore.Timestamp.now(),
                                })
                                navigation.navigate("Details")
                            },
                        },
                    ]
                )

                break
            }
            case "Bhav": {
                if (!cash || !silverPrice) {
                    alert("please fill the required fields.")
                    break
                }
                const mpay = {
                    type: type,
                    cash: parseInt(cash),
                    silverPrice: parseInt(silverPrice),
                    fineBhav: roundoff(
                        (parseInt(cash) * 1000) / parseInt(silverPrice)
                    ),
                    createdAt: firebase.firestore.Timestamp.now(),
                    userId: user.id,
                    customerId: customer.id,
                    customerName: customer.name,
                }
                Alert.alert(
                    "Confirm Payment",
                    "Cash: " +
                        mpay.cash.toString() +
                        "\nSilver Price: " +
                        mpay.silverPrice.toString() +
                        "\nFine Silver: " +
                        mpay.fineBhav.toString(),
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Confirm",
                            onPress: () => {
                                userRef.collection("payments").add(mpay)
                                userRef.update({
                                    cash: firebase.firestore.FieldValue.increment(
                                        -mpay.cash
                                    ),
                                    fineWeight: firebase.firestore.FieldValue.increment(
                                        -mpay.fineBhav
                                    ),
                                    ladder: firebase.firestore.FieldValue.arrayUnion(
                                        {
                                            lFine: mpay.fineBhav,
                                            lCash: mpay.cash,
                                            lDate: firebase.firestore.Timestamp.now(),
                                            type: "payment-bhav",
                                        }
                                    ),
                                    lastUpdated: firebase.firestore.Timestamp.now(),
                                })
                                navigation.navigate("Details")
                            },
                        },
                    ]
                )
                break
            }
            case "Labour": {
                if (!cash) {
                    alert("please fill the required fields.")
                    break
                }
                const mpay = {
                    type: type,
                    cash: parseInt(cash),
                    createdAt: firebase.firestore.Timestamp.now(),
                    userId: user.id,
                    customerId: customer.id,
                    customerName: customer.name,
                }
                Alert.alert(
                    "Confirm Payment",
                    "Cash: " + mpay.cash.toString(),
                    [
                        { text: "Cancel", style: "cancel" },
                        {
                            text: "Confirm",
                            onPress: () => {
                                userRef.collection("payments").add(mpay)
                                userRef.update({
                                    labour: firebase.firestore.FieldValue.increment(
                                        -mpay.cash
                                    ),
                                    ladder: firebase.firestore.FieldValue.arrayUnion(
                                        {
                                            lLabour: mpay.cash,
                                            lDate: firebase.firestore.Timestamp.now(),
                                            type: "payment",
                                        }
                                    ),
                                    lastUpdated: firebase.firestore.Timestamp.now(),
                                })
                                navigation.navigate("Details")
                            },
                        },
                    ]
                )
                break
            }

            default:
                alert("Please select the payment type from Picker.")
        }
    }

    const Fields = () => {
        switch (type) {
            case "Silver":
                return (
                    <View>
                        <TextInput
                            style={styles.input}
                            right={<TextInput.Icon name="weight-gram" />}
                            label="Weight(g)"
                            mode="outlined"
                            value={weight}
                            onChangeText={(text) => setWeight(text)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            right={<TextInput.Icon name="percent" />}
                            label="Fine(%)"
                            mode="outlined"
                            value={fine}
                            onChangeText={(text) => setFine(text)}
                            keyboardType="numeric"
                        />
                    </View>
                )

            case "Cash":
                return (
                    <View>
                        <TextInput
                            style={styles.input}
                            right={<TextInput.Icon name="currency-inr" />}
                            label="Amount(Rs)"
                            mode="outlined"
                            value={cash}
                            onChangeText={(text) => setCash(text)}
                            keyboardType="numeric"
                        />
                    </View>
                )

            case "Bhav":
                return (
                    <View>
                        <TextInput
                            style={styles.input}
                            label="Amount(Rs)"
                            right={<TextInput.Icon name="currency-inr" />}
                            mode="outlined"
                            value={cash}
                            onChangeText={(text) => setCash(text)}
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            label="Silver Price(per Kg)"
                            right={<TextInput.Icon name="weight-kilogram" />}
                            mode="outlined"
                            value={silverPrice}
                            onChangeText={(text) => setSilverPrice(text)}
                            keyboardType="numeric"
                        />
                    </View>
                )

            case "Labour":
                return (
                    <View>
                        <TextInput
                            style={styles.input}
                            mode="outlined"
                            label="Amount(Rs)"
                            right={<TextInput.Icon name="currency-inr" />}
                            value={cash}
                            onChangeText={(text) => setCash(text)}
                            keyboardType="numeric"
                        />
                    </View>
                )

            default:
                return (
                    <Text style={{ color: "red" }}>
                        Please select Payment Type,
                    </Text>
                )
        }
    }

    return (
        <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
            <View style={styles.top}>
                <Text
                    style={{
                        color: "#fca311",
                        marginBottom: 12,
                    }}
                >
                    Please select Payment Type.
                </Text>
                <View style={styles.pickerView}>
                    <Picker
                        style={styles.picker}
                        mode="dropdown"
                        selectedValue={type}
                        onValueChange={(itemValue) => setType(itemValue)}
                    >
                        <Picker.Item label="Cash(Jama)" value="Cash" />
                        <Picker.Item label="Bhav-Katana" value="Bhav" />
                        <Picker.Item label="Labour" value="Labour" />
                        <Picker.Item label="Silver" value="Silver" />
                    </Picker>
                </View>
            </View>
            <View style={styles.oval} />
            <View
                style={{
                    flex: 4,
                    padding: 16,
                    justifyContent: "flex-end",
                }}
            >
                {Fields()}
            </View>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Button
                    mode="contained"
                    style={{
                        width: 152,
                        paddingVertical: 8,
                        borderRadius: 50,
                    }}
                    onPress={() => handlePay()}
                >
                    Pay
                </Button>
            </View>
        </KeyboardAvoidingView>
    )
}

export default NewPayment

const styles = StyleSheet.create({
    top: {
        flex: 1,
        backgroundColor: "#14213d",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    picker: {
        width: 180,
        height: 56,
    },
    pickerView: {
        width: 192,
        height: 56,
        backgroundColor: "#fca311",
        alignItems: "center",
        borderRadius: 50,
    },
    oval: {
        width: 200,
        height: 200,
        borderRadius: 100,
        zIndex: -1,
        marginTop: -160,
        transform: [{ scaleX: 2.5 }],
        backgroundColor: "#14213d",
        alignSelf: "center",
    },
    input: {
        marginTop: 16,
    },
})
