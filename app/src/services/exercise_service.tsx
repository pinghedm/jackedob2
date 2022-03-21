const exerciseData = [
    {
        name: 'Exercise 1 Name',
        slugName: 'exercise-1-name',

        sets: [
            { weight: 15, reps: 5, date: '2022-01-01T00:00:00.000Z' },
            { weight: 15, reps: 5, date: '2022-01-01T10:00:00.000Z' },
            { weight: 15, reps: 5, date: '2022-01-01T20:00:00.000Z' },
        ],
    },
    {
        name: 'Exercise 2 Name',
        slugName: 'exercise-2-name',

        sets: [
            { weight: 15, reps: 5, date: '2022-01-01T00:00:00.000Z' },
            { weight: 15, reps: 5, date: '2022-01-01T10:00:00.000Z' },
            { weight: 15, reps: 5, date: '2022-01-01T20:00:00.000Z' },
        ],
    },
]

export interface ExerciseInfo {
    name: string
    slugName: string
    sets: { weight: number; reps: number; date: string }[]
}

export const getExerciseDetails = (exerciseSlugName: string) => {
    return exerciseData.find(e => e.slugName === exerciseSlugName)
}

export const mostRecentSet = (sets: ExerciseInfo['sets']) =>
    sets
        .sort((s1, s2) => (s1.date < s2.date ? -1 : 1))
        .slice(-1)
        .pop()

export const getSetsFromSameSession = (date: Date | string, exerciseInfo: ExerciseInfo) => {
    // we will assume any sets on the same calendar day as date are the same session
    let ymd: string
    if (date instanceof Date) {
        ymd = date.toISOString().split('T')[0]
    } else {
        ymd = date.split('T')[0]
    }
    return exerciseInfo.sets.filter(s => s.date.startsWith(ymd))
}
