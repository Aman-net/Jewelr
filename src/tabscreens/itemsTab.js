import React, { useContext, useEffect, useState } from "react"
import { View, ScrollView, StyleSheet, Text } from "react-native"
import { Title, TextInput, Button } from "react-native-paper"
import ItemCard from "../components/itemCard"
import { firebase } from "../firebase/config"
import { AuthContext } from "../main"

const ItemsTab = () => {
    const [itemname, setItemname] = useState("")
    const [itemList, setItemList] = useState([])
    const user = useContext(AuthContext)
    const itemRef = firebase
        .firestore()
        .collection("users")
        .doc(user.id)
        .collection("items")

    const addItem = () => {
        itemRef.add({ name: itemname })
    }

    useEffect(() => {
        itemRef.onSnapshot((querySnapshot) => {
            setItemList([])
            querySnapshot.forEach((doc) => {
                setItemList((prevState) => {
                    return [...prevState, doc.data().name]
                })
            })
        })
    }, [])

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: "#e5e5e5",
            }}
        >
            <Text
                style={{
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    backgroundColor: "#14213d",
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: "bold",
                }}
            >
                Items
            </Text>
            <View style={{ flexDirection: "row", marginVertical: 16 }}>
                <View style={{ flex: 2, marginLeft: 16 }}>
                    <TextInput
                        right={<TextInput.Icon name="card-text" />}
                        mode="outlined"
                        label="Item Name"
                        onChangeText={(text) => setItemname(text)}
                    />
                </View>
                <View
                    style={{
                        flex: 1,
                        marginRight: 16,
                        marginLeft: 8,
                        justifyContent: "center",
                    }}
                >
                    <Button
                        style={{
                            borderRadius: 12,
                        }}
                        labelStyle={{
                            height: 32,
                        }}
                        mode="contained"
                        onPress={() => addItem()}
                    >
                        Add Item
                    </Button>
                </View>
            </View>
            <ScrollView>
                {itemList.map((item) => {
                    return <ItemCard name={item} key={item} />
                })}
            </ScrollView>
        </View>
    )
}

export default ItemsTab

const styles = StyleSheet.create({
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: 16,
    },
})
