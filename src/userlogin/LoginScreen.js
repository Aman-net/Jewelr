import React, { useState } from "react"
import { setStatusBarBackgroundColor, StatusBar } from "expo-status-bar"
import {
    Image,
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    View,
} from "react-native"
import { TextInput, Button } from "react-native-paper"
import { firebase } from "../firebase/config"
import Loading from "./loading"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const LoginScreen = ({ navigation, setuser }) => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const onLoginPress = () => {
        if (!email || !password) {
            alert("Please fill the required fields.")
        } else {
            setIsLoading(true)
            firebase
                .auth()
                .signInWithEmailAndPassword(email.trim(), password)
                .then((response) => {
                    const uid = response.user.uid
                    const usersRef = firebase.firestore().collection("users")
                    usersRef
                        .doc(uid)
                        .get()
                        .then((firestoreDocument) => {
                            if (!firestoreDocument) {
                                alert("The user does not exists anymore.")
                                return
                            }
                            const user = firestoreDocument.data()
                            setuser(user)
                            // navigation.navigate("Tabs", {
                            //     screen: "Home",
                            //     params: { user },
                            // })
                            //this navigation was not required
                        })
                        .catch((error) => {
                            alert(error), setIsLoading(false)
                        })
                })
                .catch((error) => {
                    alert(error), setIsLoading(false)
                })
        }
    }

    const onSignUpPress = () => {
        navigation.navigate("SignUp")
    }

    return (
        <KeyboardAvoidingView behavior="height" style={styles.container}>
            <StatusBar style={setStatusBarBackgroundColor("#fca311", true)} />
            {isLoading ? (
                <Loading />
            ) : (
                <>
                    <View style={styles.top}>
                        <Image
                            style={{
                                height: 160,
                                resizeMode: "contain",
                                top: 32,
                            }}
                            source={require("../../assets/iconname.png")}
                        />
                    </View>
                    <View style={styles.bottom}>
                        <Text style={styles.login}>Login</Text>
                        <View style={styles.line} />
                        <View style={styles.inputs}>
                            <TextInput
                                left={<TextInput.Icon name="account" />}
                                style={styles.text}
                                label="Email"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                            <TextInput
                                style={styles.text}
                                left={<TextInput.Icon name="key" />}
                                label="Password"
                                value={password}
                                onChangeText={(text) => setPassword(text)}
                                autoCapitalize="none"
                                secureTextEntry={true}
                            />
                            <Button
                                style={{
                                    borderRadius: 32,
                                    paddingVertical: 4,
                                    marginTop: 16,
                                }}
                                labelStyle={{ letterSpacing: 2 }}
                                mode="contained"
                                onPress={() => onLoginPress()}
                            >
                                Login
                            </Button>
                        </View>
                        <Text style={{ alignSelf: "center", marginTop: 32 }}>
                            Don't have an account?{"  "}
                            <Text
                                style={{ color: "#fca311", fontWeight: "bold" }}
                                onPress={() => onSignUpPress()}
                                compact
                            >
                                SignUp
                            </Text>
                        </Text>
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
                </>
            )}
        </KeyboardAvoidingView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fca311",
    },
    text: {
        backgroundColor: "#fff",
        marginBottom: 24,
        elevation: 16,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 24,
    },
    top: {
        height: "30%",
        justifyContent: "center",
        alignItems: "center",
    },
    bottom: {
        flex: 1,
        backgroundColor: "white",
        borderTopLeftRadius: 72,
        elevation: 32,
    },
    inputs: {
        marginTop: 64,
        marginHorizontal: 40,
    },
    login: {
        fontSize: 32,
        alignSelf: "center",
        fontWeight: "bold",
        marginTop: 48,
        color: "#14213d",
    },
    line: {
        height: 4,
        width: 120,
        backgroundColor: "#fca311",
        alignSelf: "center",
        borderRadius: 20,
        marginTop: 8,
    },
})
