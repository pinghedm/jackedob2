import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import {
    getExerciseDetails,
    mostRecentSet,
    ExerciseInfo,
    getSetsFromSameSession,
} from 'services/exercise_service'
import { getPlanDetails } from 'services/plans_service'
import { InputNumber, Button } from 'antd'
import { cheapSlugify } from 'services/utils'
export interface ExerciseProps {}

const Exercise = ({}: ExerciseProps) => {
    const location = useLocation() // TODO If part of a plan flow, show a 'next' button or something?
    const planToken = location.pathname.split('/').find(seg => seg.startsWith('P_'))
    const plan = getPlanDetails(planToken ?? '')
    const unfinishedExercisesInPlan: string[] = []
    plan?.exerciseNames?.forEach(name => {
        console.log(name)
        const exercise = getExerciseDetails(cheapSlugify(name))
        console.log(exercise)
        if (exercise) {
            const doneToday = getSetsFromSameSession(new Date(), exercise).length
            if (!doneToday) {
                unfinishedExercisesInPlan.push(name)
            }
        }
    })

    const exerciseSlugName = location.pathname.split('/').slice(-1).pop() ?? ''
    const exerciseInfo = getExerciseDetails(exerciseSlugName)
    const newestSet = mostRecentSet(exerciseInfo?.sets ?? [])

    const [setsToday, setSetsToday] = useState<ExerciseInfo['sets']>([])
    const [newReps, setNewReps] = useState<number | null>(null)
    const [newWeight, setNewWeight] = useState<number | null>(null)

    return (
        <div>
            {exerciseInfo && newestSet ? (
                <div>
                    Last Time: {new Date(newestSet.date).toDateString()}
                    <br />
                    {getSetsFromSameSession(newestSet.date, exerciseInfo).map(s => (
                        <div>
                            {s.reps} @ {s.weight}
                        </div>
                    ))}
                </div>
            ) : null}
            <div>This time, completed sets</div>
            {setsToday.map(s => (
                <div>
                    {s.reps} @ {s.weight}
                </div>
            ))}
            <div>
                <InputNumber
                    value={newReps ?? ''}
                    defaultValue={0}
                    placeholder="Num reps"
                    onChange={val => setNewReps(val || 0)}
                />{' '}
                @{' '}
                <InputNumber
                    value={newWeight ?? ''}
                    defaultValue={0}
                    placeholder="Weight (lbs)"
                    onChange={val => setNewWeight(val || 0)}
                />
            </div>
            <Button
                disabled={!newWeight || !newReps}
                onClick={e => {
                    if (!!newWeight && !!newReps) {
                        setSetsToday([
                            ...setsToday,
                            { weight: newWeight, reps: newReps, date: new Date().toISOString() },
                        ])
                        setNewReps(0)
                        // leave weight filled out the same, for convenience
                    }
                }}>
                Done
            </Button>
            {plan
                ? unfinishedExercisesInPlan
                      .filter(name => name !== exerciseInfo?.name)
                      .map(name => (
                          <Link
                              to={`${location.pathname.replace(
                                  exerciseSlugName,
                                  cheapSlugify(name),
                              )}`}>
                              {name}
                          </Link>
                      ))
                : null}
        </div>
    )
}

export default Exercise
