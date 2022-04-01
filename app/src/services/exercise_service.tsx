import { useQuery, useQueries } from 'react-query'
import { db, auth } from 'services/firebase'
import { collection, query, getDocs, setDoc, doc, getDoc } from 'firebase/firestore'

export interface ExerciseInfo {
    name: string
    slugName: string
    bodyWeight?: boolean
}

export interface ExerciseDetail extends ExerciseInfo {
    sets: { weight: number | null; reps: number; date: string; notes?: string }[]
}

export const useExercises = () => {
    const query = useQuery(['exercises'], getExercises)
    return query
}

const getExercises = async () => {
    const user = auth.currentUser
    if (user === null) {
        return []
    }
    const ref = collection(db, 'exercises')
    const q = query(ref)
    const queryResult = await getDocs(q)
    const exercises: ExerciseInfo[] = []
    queryResult.forEach(d => exercises.push(d.data() as ExerciseInfo))
    return exercises
}

export const updateExercise = async (exerciseInfo: ExerciseInfo) => {
    await setDoc(doc(db, `exercises/${exerciseInfo.slugName}`), exerciseInfo)
    return exerciseInfo
}

export const updateExerciseDetails = async (exerciseDetails: ExerciseDetail) => {
    const user = auth.currentUser
    if (!user) {
        return null
    }
    const ref = doc(db, `users/${user.uid}/exercises/${exerciseDetails.slugName}`)
    await setDoc(ref, exerciseDetails)
    return exerciseDetails
}

const getExerciseDetails = async (
    slugName: string,
    uid?: string,
): Promise<ExerciseDetail | null> => {
    const user = auth.currentUser
    if (!user) {
        return null
    }
    const eRef = doc(db, 'exercises', slugName)
    const exerciseInfo = (await getDoc(eRef)).data() as ExerciseInfo
    const ref = doc(db, `users/${uid ?? user.uid}/exercises/${slugName}`)
    const details = ((await getDoc(ref)).data() ?? {}) as ExerciseDetail
    return { ...exerciseInfo, sets: details?.sets?.filter(s => !!s) ?? [] }
}
export const useExerciseDetails = (exerciseSlugNames: string[], uid?: string): ExerciseDetail[] => {
    const queries = useQueries(
        exerciseSlugNames.map(name => ({
            queryKey: ['exercises', name],
            queryFn: () => getExerciseDetails(name, uid),
        })),
    )
    if (queries.every(q => q.status === 'success')) {
        return queries.map(q => q.data).filter((data): data is ExerciseDetail => data !== null)
    }
    return []
}

export const mostRecentSet = (sets: ExerciseDetail['sets']) =>
    sets
        .sort((s1, s2) => (s1.date < s2.date ? -1 : 1))
        .slice(-1)
        .pop()

export const getSetsFromSameSession = (date: Date | string, exerciseInfo: ExerciseDetail) => {
    // we will assume any sets on the same calendar day as date are the same session
    let ymd: string
    if (date instanceof Date) {
        ymd = date.toISOString().split('T')[0]
    } else {
        ymd = date.split('T')[0]
    }
    return exerciseInfo.sets.filter(s => s.date.startsWith(ymd))
}
