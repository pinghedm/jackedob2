export interface WorkoutPlan {
    name: string
    token: string
    numExercises: 5
    lastUpdated?: string // iso string
}

export interface WorkoutPlanDetails extends WorkoutPlan {
    exercises: {
        name: string
        lastTime: {
            date: string // iso string
            sets: { weight: number; reps: number }[]
        }
    }[]
}

const plans: WorkoutPlan[] = [
    { name: 'Danny - Sunday', token: 'P_SUNDAY', numExercises: 5 },
    { name: 'Danny - Tuesday', token: 'P_TUESDAY', numExercises: 5 },
    { name: 'Danny - Thursday', token: 'P_THURSDAY', numExercises: 5 },
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
            exercises: [
                {
                    name: 'Exercise 1 Name',
                    lastTime: {
                        date: yesterday.toISOString(),
                        sets: [
                            { weight: 15, reps: 5 },
                            { weight: 15, reps: 5 },
                            { weight: 15, reps: 5 },
                        ],
                    },
                },
            ],
        }
    } else {
        return null
    }
}
