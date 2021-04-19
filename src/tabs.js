import React from "react"
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs"
import HomeTab from "./tabscreens/homeTab"
import CustomersTab from "./tabscreens/customersTab"
import HelpTab from "./tabscreens/helpTab"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"

const Tab = createMaterialBottomTabNavigator()

const Tabs = ({ navigation }) => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            activeColor="#fca311"
            barStyle={{
                backgroundColor: "#14213d",
                padding: 4,
                overflow: "hidden",
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeTab}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="home"
                            color={color}
                            size={26}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Customers"
                component={CustomersTab}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="account-multiple"
                            color={color}
                            size={26}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="Menu"
                component={HelpTab}
                options={{
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name="menu"
                            color={color}
                            size={26}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    )
}

export default Tabs
