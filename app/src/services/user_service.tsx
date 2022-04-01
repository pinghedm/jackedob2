import { useQuery } from 'react-query'
import { db, auth } from 'services/firebase'
import { doc, getDoc, getDocs, setDoc, collection, query, where } from 'firebase/firestore'
export interface UserDetails {
    historyPublic: boolean
    displayName: string
    email: string
    uid: string
}

export const useUserDetails = () => {
    const query = useQuery(['userDetails'], getUserDetails)
    return query
}

const getUserDetails = async () => {
    const user = auth.currentUser
    if (user === null) {
        return null
    }
    const userEmail = user?.email
    if (!userEmail) {
        return null
    }
    const ref = doc(db, `users/${user.uid}`)
    const userDetailsLazy = await getDoc(ref)
    const userDetails = userDetailsLazy.data() as UserDetails
    return userDetails
}

export const updateUserDetails = async (userDetails: Omit<UserDetails, 'email' | 'uid'>) => {
    const user = auth.currentUser
    if (!user || !user?.email) {
        return null
    }
    const ref = doc(db, `users/${user.uid}`)
    const details = { ...userDetails, email: user.email, uid: user.uid }
    await setDoc(ref, details)
    return details
}

export const usePublicUsers = () => {
    const query = useQuery(['publicUsers'], getPublicUsers)
    return query
}

const getPublicUsers = async () => {
    const user = auth.currentUser
    if (user === null) {
        return []
    }

    const ref = collection(db, 'users')
    const q = query(ref, where('historyPublic', '==', true))
    const lazyRes = await getDocs(q)
    const publicUserDetails: UserDetails[] = []
    lazyRes.forEach(d => {
        const pud = d.data()
        if (pud.email !== user.email) {
            publicUserDetails.push(pud as UserDetails)
        }
    })
    return publicUserDetails
}
