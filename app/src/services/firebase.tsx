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

const firebaseConfig = {
    apiKey: 'AIzaSyA1kpjSV82sGSnh0LXgrluWL3KZH8xbBb4',
    authDomain: 'jackedob2.firebaseapp.com',
    projectId: 'jackedob2',
    storageBucket: 'jackedob2.appspot.com',
    messagingSenderId: '195212004841',
    appId: '1:195212004841:web:408503735b2194b5d60f78',
}
const app = initializeApp(firebaseConfig)
const auth = getAuth()
const emulatorAuthDomain = process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || ''
if (emulatorAuthDomain.includes('localhost')) {
    connectAuthEmulator(auth, emulatorAuthDomain)
}
const db = getFirestore(app)
const emulatorDatabaseUrl = process.env.REACT_APP_FIRESTORE_URL || ''
if (emulatorDatabaseUrl) {
    connectFirestoreEmulator(
        db,
        emulatorDatabaseUrl.split('//')[1].split(':')[0],
        Number(emulatorDatabaseUrl.split(':')[1].split(':')[0]),
    )
}

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
