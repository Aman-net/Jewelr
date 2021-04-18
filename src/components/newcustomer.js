import React, { useContext, useState } from "react"
import { Alert, StyleSheet, Text, View } from "react-native"
import { Avatar, Button, TextInput } from "react-native-paper"
import { AuthContext } from "../main"
import { firebase } from "../firebase/config"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"
import { ScrollView } from "react-native-gesture-handler"

const NewCustomer = ({ navigation }) => {
    const [name, setName] = useState("")
    const [phoneNo, setPhoneNo] = useState("")
    const [address, setAddress] = useState("")
    const [fine, setFine] = useState("")
    const [cash, setCash] = useState("")
    const [labour, setLabour] = useState("")

    const user = useContext(AuthContext)

    const addCustomer = () => {
        if (!name || !phoneNo || !address) {
            return alert("Please fill the required fields.")
        }
        Alert.alert(
            "New Customer",
            "Name: " +
                name +
                "\nPhone no.: " +
                phoneNo +
                "\nAddress: " +
                address +
                "\nFine: " +
                fine +
                "\nCash: " +
                cash +
                "\nLabour: " +
                labour,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Add",
                    onPress: () => {
                        const userRef = firebase
                            .firestore()
                            .collection("users")
                            .doc(user.id)
                            .collection("customers")
                        userRef
                            .add({
                                name: name,
                                phoneNo: phoneNo,
                                address: address,
                                fineWeight: parseFloat(fine) || 0,
                                cash: parseFloat(cash) || 0,
                                labour: parseFloat(labour) || 0,
                                active: true,
                                ladder: [],
                                lastUpdated: firebase.firestore.Timestamp.now(),
                            })
                            .then(console.log("document written"))
                            .then(navigation.navigate("Customers"))
                            .catch((error) => console.log(error))
                    },
                },
            ]
        )
    }

    return (
        <KeyboardAwareScrollView
            enableAutomaticScroll={true}
            enableOnAndroid={true}
            contentContainerStyle={styles.container}
        >
            <View style={styles.curve} />
            <View style={styles.oval} />
            <View style={{ marginTop: -150 }}>
                <Avatar.Icon
                    size={80}
                    icon="account"
                    style={{ alignSelf: "center" }}
                />
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    right={<TextInput.Icon name="account" />}
                    onChangeText={(text) => setName(text)}
                    value={name}
                    label="Full Name"
                />
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    right={<TextInput.Icon name="phone" />}
                    onChangeText={(text) => setPhoneNo(text)}
                    value={phoneNo}
                    label="Phone No."
                    keyboardType="phone-pad"
                    maxLength={10}
                />
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    right={<TextInput.Icon name="home-city" />}
                    onChangeText={(text) => setAddress(text)}
                    value={address}
                    label="Address"
                    multiline
                />
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    right={<TextInput.Icon name="weight-gram" />}
                    onChangeText={(text) => setFine(text)}
                    value={fine}
                    label="Initial unpaid Fine Silver"
                    keyboardType="numeric"
                />
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    right={<TextInput.Icon name="currency-inr" />}
                    onChangeText={(text) => setCash(text)}
                    value={cash}
                    label="Initial deposited Cash"
                    keyboardType="numeric"
                />
                <TextInput
                    mode="outlined"
                    style={styles.input}
                    right={<TextInput.Icon name="currency-inr" />}
                    onChangeText={(text) => setLabour(text)}
                    value={labour}
                    label="Initial unpaid Labour"
                    keyboardType="numeric"
                />
                <Button
                    style={styles.add}
                    mode="contained"
                    onPress={() => addCustomer()}
                >
                    Add
                </Button>
            </View>
        </KeyboardAwareScrollView>
    )
}

export default NewCustomer

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    input: {
        marginHorizontal: 16,
        marginTop: 16,
    },
    add: {
        width: "60%",
        margin: 32,
        alignSelf: "center",
        borderRadius: 50,
        paddingVertical: 4,
    },
    oval: {
        width: 200,
        height: 200,
        borderRadius: 100,
        zIndex: -2,
        marginTop: -140,
        transform: [{ scaleX: 2.5 }],
        backgroundColor: "#fca311",
        alignSelf: "center",
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
})
