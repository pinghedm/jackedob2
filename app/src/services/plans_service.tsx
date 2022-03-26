import { ExerciseInfo, getExerciseDetails } from 'services/exercise_service'
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
    exercises: ExerciseInfo[]
}

const plans: WorkoutPlan[] = [
    {
        name: 'Danny - Sunday',
        token: 'P_SUNDAY',
        exerciseNames: ['Exercise 1 Name', 'Exercise 2 Name'],
    },
    { name: 'Danny - Tuesday', token: 'P_TUESDAY', exerciseNames: ['Exercise 1 Name'] },
    { name: 'Danny - Thursday', token: 'P_THURSDAY', exerciseNames: ['Exercise 1 Name'] },
]

export const updatePlan = async (planToken: string, planData: WorkoutPlan) => {
    const user = auth.currentUser
    if (user === null) {
        console.log('bad')
        return {}
    }
    const now = new Date()
    const newPlanInfo = { ...planData, token: planToken, lastUpdated: now.toISOString() }
    console.log('good', user.uid)
    try {
        await setDoc(doc(db, `/users/${user.uid}/plans`, planToken), newPlanInfo)
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
    const ref = collection(db, `/users/${user.uid}/plans`)
    const q = query(ref)
    const queryResult = await getDocs(q)
    const plans: WorkoutPlan[] = []
    queryResult.forEach(d => plans.push(d.data() as WorkoutPlan))
    return plans
}
export const usePlanDetails = (planToken: string) => {
    const query = useQuery(['plans', planToken], () => getPlanDetails(planToken))
    return query
}

const getPlanDetails = async (planToken: string) => {
    const user = auth.currentUser
    if (user === null) {
        return null
    }
    const ref = doc(db, `/users/${user.uid}/plans/${planToken}`)
    const plan = (await getDoc(ref)).data() as WorkoutPlanDetails
    if (plan) {
        return {
            ...plan,
            exercises: plan.exerciseNames
                .map(name => getExerciseDetails(cheapSlugify(name)))
                .filter(e => e !== undefined) as ExerciseInfo[],
        }
    } else {
        return null
    }
}
