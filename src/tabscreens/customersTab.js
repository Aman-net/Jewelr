import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import customerHome from "../components/customerHome"
import CustomerDetails from "../components/customerDetails"
import NewCustomer from "../components/newcustomer"
import NewTransaction from "../components/newTransaction"
import NewPayment from "../components/newPayment"
import TransactionDetails from "../components/transactionDetails"
import Ladder from "../components/ladder"
import NewBill from "../components/newBill"

const customerStack = createStackNavigator()

const CustomersTab = () => {
    return (
        <customerStack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#14213d",
                    height: 50,
                },
                headerTintColor: "white",
            }}
        >
            <customerStack.Screen name="Customers" component={customerHome} />
            <customerStack.Screen name="Details" component={CustomerDetails} />
            <customerStack.Screen name="Ladder" component={Ladder} />
            <customerStack.Screen name="NewCustomer" component={NewCustomer} />
            <customerStack.Screen
                name="New Transaction"
                component={NewTransaction}
            />
            <customerStack.Screen name="New Payment" component={NewPayment} />
            <customerStack.Screen
                name="Transaction Details"
                component={TransactionDetails}
            />
            <customerStack.Screen
                name="Bill"
                options={{ header: () => null }}
                component={NewBill}
            />
        </customerStack.Navigator>
    )
}

export default CustomersTab
