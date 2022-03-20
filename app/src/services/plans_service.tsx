export interface WorkoutPlan {
    name: string
    token: string
    numExercises: 5
    lastUpdated?: string // iso string
}

const plans: WorkoutPlan[] = [
    { name: 'Danny - Sunday', token: 'P_SUNDAY', numExercises: 5 },
    { name: 'Danny - Tuesday', token: 'P_TUESDAY', numExercises: 5 },
    { name: 'Danny - Thursday', token: 'P_THURSDAY', numExercises: 5 },
] // TODO: get from api?

export const getPlans = () => {
    return plans
}
