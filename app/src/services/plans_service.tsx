import { ExerciseInfo, getExerciseDetails } from 'services/exercise_service'
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

export const getPlans = () => {
    return plans // TODO: hit api
}

export const getPlanDetails = (planToken: string): WorkoutPlanDetails | null => {
    const plan = plans.find(p => p.token === planToken)
    if (plan) {
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        return {
            ...plan,
            exercises: plan.exerciseNames
                .map(name => getExerciseDetails(name))
                .filter(e => !e !== undefined) as ExerciseInfo[],
        }
    } else {
        return null
    }
}
