import React, { useRef } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { DataTable, IconButton, Title } from "react-native-paper"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import { captureRef } from "react-native-view-shot"
import * as Sharing from "expo-sharing"

const TransactionDetails = ({ navigation, route }) => {
    const { details, customer } = route.params
    const refScreen = useRef(null)

    const handleShare = () => {
        captureRef(refScreen, { format: "jpg", quality: 0.8 }).then(
            (uri) => {
                Sharing.shareAsync(uri, {
                    dialogTitle: "Share Transaction",
                    mimeType: "image/jpg",
                })
            },
            (error) => console.error("Oops, snapshot failed", error)
        )
    }

    return (
        <View ref={refScreen} style={styles.container}>
            <View style={styles.top}>
                <View>
                    <Text
                        style={{
                            color: "#fca311",
                            marginLeft: 24,
                            fontSize: 24,
                            fontWeight: "bold",
                            letterSpacing: 1,
                        }}
                    >
                        {customer.name}
                    </Text>
                    <Text
                        style={{
                            color: "#fff",
                            marginLeft: 24,
                            fontSize: 16,
                        }}
                    >
                        {details.createdAt.toDate().toString().substr(0, 21)}
                    </Text>
                </View>
                <View
                    style={{
                        backgroundColor: "#fca311",
                        marginRight: 16,
                        borderRadius: 50,
                    }}
                >
                    <IconButton
                        icon="share-variant"
                        size={28}
                        color="#14213d"
                        onPress={() => handleShare()}
                    />
                </View>
            </View>
            <View style={styles.oval} />
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    marginTop: -64,
                }}
            >
                <View style={styles.totalCard}>
                    <Text style={styles.finetext}>Total Fine(g) </Text>
                    <Text style={styles.finedata}>{details.tFine}</Text>
                    <View style={styles.line} />
                </View>
                <View style={styles.totalCard}>
                    <Text style={styles.finetext}>Total Labour(Rs) </Text>
                    <Text style={styles.finedata}>{details.tLabour}</Text>
                    <View style={styles.line} />
                </View>
            </View>
            <View style={{ flex: 5 }}>
                <DataTable style={styles.table}>
                    <DataTable.Header style={{ backgroundColor: "#fca31160" }}>
                        <DataTable.Title> Item </DataTable.Title>
                        <DataTable.Title numeric>Weight(g)</DataTable.Title>
                        <DataTable.Title numeric>Fine(%)</DataTable.Title>
                        <DataTable.Title numeric>Fine-W</DataTable.Title>
                        <DataTable.Title numeric>Labour</DataTable.Title>
                        <DataTable.Title numeric>T-Labour</DataTable.Title>
                    </DataTable.Header>
                    <ScrollView>
                        {details.tItems.map((transItem) => {
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
                    </ScrollView>
                </DataTable>
            </View>
            <View
                style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    position: "absolute",
                    bottom: 24,
                }}
            >
                <Text> Made with </Text>
                <MaterialCommunityIcons name="heart" size={24} color="red" />
                <Text> by Aman</Text>
            </View>
        </View>
    )
}

export default TransactionDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#e5e5e5",
    },
    table: {
        backgroundColor: "#fff",
    },
    top: {
        backgroundColor: "#14213d",
        color: "#fff",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    oval: {
        width: 200,
        height: 200,
        borderRadius: 100,
        zIndex: -1,
        marginTop: -100,
        transform: [{ scaleX: 2.5 }],
        backgroundColor: "#14213d",
        alignSelf: "center",
    },
    totalCard: {
        height: 120,
        width: 160,
        backgroundColor: "white",
        borderRadius: 24,
        marginBottom: 24,
        elevation: 12,
        alignItems: "center",
    },
    finetext: {
        margin: 12,
    },
    finedata: {
        fontSize: 28,
        fontWeight: "bold",
    },
    line: {
        height: 4,
        width: 64,
        backgroundColor: "#fca311",
        borderRadius: 20,
    },
})
