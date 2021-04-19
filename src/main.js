import React, { useEffect, useState } from "react"
import Tabs from "./tabs"
import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "./userlogin/LoginScreen"
import SignupScreen from "./userlogin/SignupScreen"
import { firebase } from "./firebase/config"
import Loading from "./userlogin/loading"

const Stack = createStackNavigator()

const AuthContext = React.createContext({})
const SetQ = React.createContext(null)

export default function Main() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const usersRef = firebase.firestore().collection("users")
        firebase.auth().onAuthStateChanged((user) => {
            if (user != null) {
                usersRef
                    .doc(user.uid)
                    .get()
                    .then((document) => {
                        const userData = document.data()
                        setLoading(false)
                        setUser(userData)
                    })
                    .catch((error) => {
                        setLoading(false)
                        alert(error)
                    })
            } else {
                setLoading(false)
            }
        })
    }, [])

    if (loading) {
        return <Loading />
    }

    return (
        <Stack.Navigator headerMode="none">
            {user ? (
                <Stack.Screen name="Tabs">
                    {(props) => (
                        <AuthContext.Provider value={user}>
                            <SetQ.Provider value={setUser}>
                                <Tabs {...props} />
                            </SetQ.Provider>
                        </AuthContext.Provider>
                    )}
                </Stack.Screen>
            ) : (
                <>
                    <Stack.Screen name="Login">
                        {(props) => (
                            <LoginScreen {...props} setuser={setUser} />
                        )}
                    </Stack.Screen>
                    <Stack.Screen name="SignUp">
                        {(props) => <SignupScreen {...props} />}
                    </Stack.Screen>
                </>
            )}
        </Stack.Navigator>
    )
}

export { AuthContext, SetQ }
