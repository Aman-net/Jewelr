import * as firebase from "firebase"
import "@firebase/auth"
import "@firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAF3ROowxpMYPV-B9DYQ0MmVCpdbPakI6Q",
    authDomain: "mpro1-bb081.firebaseapp.com",
    projectId: "mpro1-bb081",
    storageBucket: "mpro1-bb081.appspot.com",
    messagingSenderId: "316424563308",
    appId: "1:316424563308:web:bff40764bee6a12db6c649",
    measurementId: "G-GE347HP3W8",
}
// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

export { firebase }
