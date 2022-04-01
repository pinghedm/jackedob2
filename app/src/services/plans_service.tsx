import { ExerciseDetail, useExerciseDetails } from 'services/exercise_service'
import { cheapSlugify } from 'services/utils'
import { useQuery } from 'react-query'
import { collection, setDoc, getDoc, doc, query, getDocs } from 'firebase/firestore'
import { db, auth } from 'services/firebase'
export interface WorkoutPlan {
    name: string
    token: string
    exerciseNames: string[]
    lastUpdated?: string // iso string
}

export interface WorkoutPlanDetails extends WorkoutPlan {
    exercises: ExerciseDetail[]
}

export const updatePlan = async (planToken: string, planData: WorkoutPlan) => {
    const user = auth.currentUser
    if (user === null) {
        return {}
    }
    const now = new Date()
    const newPlanInfo = {
        name: planData.name,
        exerciseNames: planData.exerciseNames,
        token: planToken,
        lastUpdated: now.toISOString(),
    }
    try {
        await setDoc(doc(db, `users/${user.uid}/plans`, planToken), newPlanInfo)
        return newPlanInfo
    } catch (e) {
        console.log(e)
    }
}

export const usePlans = () => {
    const query = useQuery(['plans'], getPlans)
    return query
}

const getPlans = async () => {
    const user = auth.currentUser
    if (user === null) {
        return []
    }
    const ref = collection(db, `users/${user.uid}/plans`)
    const q = query(ref)
    const queryResult = await getDocs(q)
    const plans: WorkoutPlan[] = []
    queryResult.forEach(d => plans.push(d.data() as WorkoutPlan))
    return plans
}
export const usePlanDetails = (planToken: string): WorkoutPlanDetails | null => {
    const query = useQuery(['plans', planToken], () => getPlanDetails(planToken))
    const exerciseDetails = useExerciseDetails(
        query?.data?.exerciseNames?.map(n => cheapSlugify(n)) ?? [],
    )
    if (query.status === 'success' && query.data !== null) {
        return { ...query.data, exercises: exerciseDetails }
    }
    return null
}

const getPlanDetails = async (planToken: string): Promise<WorkoutPlanDetails | null> => {
    const user = auth.currentUser
    if (user === null) {
        return null
    }
    const ref = doc(db, `users/${user.uid}/plans/${planToken}`)
    const plan = (await getDoc(ref)).data() as WorkoutPlanDetails
    return plan
}
