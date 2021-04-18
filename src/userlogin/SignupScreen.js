import React, { useState } from "react"
import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    View,
    Image,
} from "react-native"
import { TextInput, Button, IconButton } from "react-native-paper"
import { firebase } from "../firebase/config"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const SignupScreen = ({ navigation }) => {
    const [fullname, setFullname] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmpassword, setConfirmpassword] = useState("")

    const onRegisterPress = () => {
        if (!fullname || !email || !password || !confirmpassword) {
            alert("Please fill all the required fields.")
            return
        }
        if (password !== confirmpassword) {
            alert("Password dosen't match.")
            return
        }
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((response) => {
                const uid = response.user.uid
                const data = { id: uid, email, fullname, profileUrl: "" }
                const usersRef = firebase.firestore().collection("users")
                usersRef
                    .doc(uid)
                    .set(data)
                    .then(() => {
                        navigation.navigate("Login")
                    })
                    .catch((error) => alert(error))
            })
            .catch((error) => alert(error))
    }

    return (
        <KeyboardAvoidingView behavior="height" style={styles.container}>
            <IconButton
                compact
                style={styles.back}
                size={40}
                icon="arrow-left"
                onPress={() => navigation.goBack()}
            />
            <View style={styles.top}>
                <Image
                    style={{
                        height: 96,
                        resizeMode: "contain",
                        top: 24,
                    }}
                    source={require("../../assets/iconname.png")}
                />
            </View>
            <View style={styles.bottom}>
                <Text style={styles.signup}>SignUp</Text>
                <View style={styles.line} />
                <View style={styles.inputs}>
                    <TextInput
                        left={<TextInput.Icon name="account" />}
                        style={styles.text}
                        label="Full Name"
                        value={fullname}
                        onChangeText={(text) => setFullname(text)}
                    />
                    <TextInput
                        left={<TextInput.Icon name="email" />}
                        style={styles.text}
                        label="Email"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={(text) => setEmail(text)}
                        keyboardType="email-address"
                    />
                    <TextInput
                        left={<TextInput.Icon name="key" />}
                        style={styles.text}
                        label="Password"
                        autoCapitalize="none"
                        value={password}
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry={true}
                    />
                    <TextInput
                        left={<TextInput.Icon name="key-plus" />}
                        style={styles.text}
                        label="Confirm Password"
                        autoCapitalize="none"
                        value={confirmpassword}
                        onChangeText={(text) => setConfirmpassword(text)}
                    />
                    <Button
                        style={{
                            borderRadius: 32,
                            paddingVertical: 4,
                            marginTop: 16,
                        }}
                        mode="contained"
                        onPress={() => onRegisterPress()}
                    >
                        Create Account
                    </Button>
                </View>
                <View>
                    <Text style={{ alignSelf: "center", marginTop: 32 }}>
                        Already got an account?{"  "}
                        <Text
                            style={{ color: "#fca311", fontWeight: "bold" }}
                            onPress={() => navigation.navigate("Login")}
                        >
                            Log in
                        </Text>
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignSelf: "center",
                        position: "absolute",
                        bottom: 24,
                    }}
                >
                    <Text style={{ fontSize: 12 }}> Made with </Text>
                    <MaterialCommunityIcons
                        name="heart"
                        size={18}
                        color="red"
                    />
                    <Text style={{ fontSize: 12 }}> by Aman</Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

export default SignupScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fca311",
    },
    top: {
        height: "18%",
        justifyContent: "center",
        alignItems: "center",
    },
    inputs: {
        marginTop: 56,
        marginHorizontal: 40,
    },
    bottom: {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 72,
        elevation: 32,
    },
    signup: {
        fontSize: 32,
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 48,
        color: "#14213d",
    },
    text: {
        backgroundColor: "white",
        marginBottom: 16,
        elevation: 16,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 24,
    },
    line: {
        height: 4,
        width: 136,
        backgroundColor: "#fca311",
        alignSelf: "center",
        borderRadius: 20,
        marginTop: 8,
    },
    back: {
        position: "absolute",
        left: 0,
        top: 0,
        marginTop: 40,
        marginLeft: 16,
        zIndex: 1,
    },
})
