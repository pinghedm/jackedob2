import { useState } from 'react'
import { initializeApp } from 'firebase/app'
import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    connectAuthEmulator,
} from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
// setLogLevel('debug')
const databaseUrl = process.env.REACT_APP_FIRESTORE_URL || '' // TODO look up what prod is
const firebaseConfig = {
    apiKey: 'AIzaSyA1kpjSV82sGSnh0LXgrluWL3KZH8xbBb4',
    authDomain: 'jackedob2.firebaseapp.com',
    projectId: 'jackedob2',
    storageBucket: 'jackedob2.appspot.com',
    messagingSenderId: '195212004841',
    appId: '1:195212004841:web:408503735b2194b5d60f78',
    // databaseURL: databaseUrl,
}
const app = initializeApp(firebaseConfig)
export const auth = getAuth()
const emulatorAuthDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || ''
if (emulatorAuthDomain.includes('localhost')) {
    connectAuthEmulator(auth, emulatorAuthDomain)
}
export const db = getFirestore(app)
if (databaseUrl.includes('localhost')) {
    connectFirestoreEmulator(
        db,
        databaseUrl.split('//')[1].split(':')[0],
        Number(databaseUrl.split(':').slice(-1).pop()),
    )
}

// auth
export const useCurrentUser = () => {
    const [curUser, setCurUser] = useState(auth.currentUser)
    onAuthStateChanged(auth, user => {
        if (user) {
            setCurUser(user)
        }
    })
    return curUser
}

export const loginUser = async (email: string, password: string) => {
    try {
        await signInWithEmailAndPassword(auth, email, password)
        return null
    } catch (error) {
        return error as { code: string; message: string }
    }
}

export const logout = async () => {
    await signOut(auth)
}
