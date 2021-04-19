import React, { useContext, useEffect, useState } from "react"
import { View, Text, StyleSheet } from "react-native"
import { Avatar, Button } from "react-native-paper"
import { AuthContext, SetQ } from "../main"
import { firebase } from "../firebase/config"
import * as ImagePicker from "expo-image-picker"

const HelpTab = () => {
    const user = useContext(AuthContext)
    const [url, setUrl] = useState("")
    const [run, setRun] = useState(false)
    const setUser = useContext(SetQ)

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
    }, [url])

    const logoutpress = () => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                setUser(null)
            })
            .catch((error) => alert(error))
    }

    const openPicker = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.2,
        })

        if (result) {
            if (result.cancelled) {
                alert("no image selected.")
            } else {
                // console.log(result)
                // const response = await fetch(result.uri)
                // const blob = await response.blob()
                // console.log("blob size =", blob.size)
                const storage = firebase.storage()
                let filename = result.uri.substring(
                    result.uri.lastIndexOf("/") + 1
                )
                const response = await fetch(result.uri)
                const blob = await response.blob()
                storage
                    .ref()
                    .child("profile/" + filename)
                    .put(blob)
                    .then((snapshot) => {
                        alert("File uploaded")
                        setRun(false)
                        firebase
                            .firestore()
                            .collection("users")
                            .doc(user.id)
                            .update({
                                profileUrl: "profile/" + filename,
                            })
                            .then(setRun(true))
                    })
            }
        }
    }

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#e5e5e5",
            }}
        >
            <View style={styles.top}>
                <View
                    style={{
                        flexDirection: "row",
                        marginTop: 20,
                        marginLeft: 16,
                    }}
                >
                    <Avatar.Image
                        source={require("../../assets/icon.png")}
                        size={48}
                    />
                    <Text
                        style={{
                            fontSize: 28,
                            fontWeight: "bold",
                            marginLeft: 8,
                            color: "#14213d",
                        }}
                    >
                        Menu
                    </Text>
                </View>
                <View
                    style={{
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 8,
                    }}
                >
                    <View style={styles.avatar}>
                        <Avatar.Image
                            size={136}
                            source={
                                user.profileUrl
                                    ? { uri: url }
                                    : require("../../assets/emptyprofile.png")
                            }
                        />
                    </View>

                    <View style={{ alignItems: "center", marginTop: 8 }}>
                        <Text
                            style={{
                                fontSize: 22,
                                color: "#14213d",
                                fontWeight: "700",
                            }}
                        >
                            {user.fullname}
                        </Text>
                        <Text style={{ color: "#000000aa", fontSize: 12 }}>
                            {user.email}
                        </Text>
                        <Button
                            mode="contained"
                            style={{ width: 160, marginTop: 16 }}
                            onPress={() => openPicker()}
                        >
                            Update
                        </Button>
                    </View>
                </View>
            </View>
            <View style={styles.oval} />
            <View
                style={{
                    flex: 1,
                }}
            >
                <Button
                    style={{
                        width: 150,
                        margin: 16,
                        padding: 5,
                        alignSelf: "center",
                    }}
                    onPress={() => logoutpress()}
                    mode="outlined"
                >
                    LogOut
                </Button>
                <View
                    style={{
                        marginTop: 120,
                        alignItems: "center",
                        position: "absolute",
                        bottom: 32,
                        width: "100%",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 14,
                            fontWeight: "700",
                            marginBottom: 8,
                        }}
                    >
                        Contact Developer
                    </Text>
                    <Text>amansoni93744@gmail.com</Text>
                </View>
            </View>
        </View>
    )
}

export default HelpTab

const styles = StyleSheet.create({
    top: {
        height: "45%",
        backgroundColor: "#fca311",
    },
    oval: {
        height: 200,
        width: 200,
        transform: [{ scaleX: 2.5 }],
        borderRadius: 100,
        backgroundColor: "#fca311",
        alignSelf: "center",
        marginTop: -160,
        zIndex: -10,
    },
    avatar: {
        justifyContent: "center",
        alignItems: "center",
    },
    textWhite: {
        color: "#fff",
    },
})
