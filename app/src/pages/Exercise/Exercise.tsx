import React, { useState } from 'react'
import { useLocation, Link, useNavigate } from 'react-router-dom'
import {
    useExerciseDetails,
    ExerciseDetail,
    mostRecentSet,
    getSetsFromSameSession,
    updateExerciseDetails,
} from 'services/exercise_service'
import { usePlanDetails } from 'services/plans_service'
import { InputNumber, Button, Typography, List } from 'antd'
import { useMutation, useQueryClient } from 'react-query'
export interface ExerciseProps {}

const Exercise = ({}: ExerciseProps) => {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const location = useLocation()
    const planToken = location.pathname.split('/').find(seg => seg.startsWith('P_'))
    const exerciseSlugName = location.pathname.split('/').slice(-1).pop() ?? ''
    const today = new Date().toDateString()

    const plan = usePlanDetails(planToken ?? 'Definitely Invalid Token')
    const thisExercise = useExerciseDetails([exerciseSlugName])?.[0]
    const newestSet = mostRecentSet(thisExercise?.sets ?? [])
    let unfinishedExercisesInPlan: ExerciseDetail[] = []
    if (planToken) {
        unfinishedExercisesInPlan =
            plan?.exercises
                ?.filter(e => {
                    const s = mostRecentSet(e.sets)
                    return (s && today !== new Date(s.date).toDateString()) || !s
                })
                .filter(e => e.name !== thisExercise?.name) ?? []
    }
    const [setsToday, setSetsToday] = useState<ExerciseDetail['sets']>([])
    const [newReps, setNewReps] = useState<number | null>(null)
    const [newWeight, setNewWeight] = useState<number | null>(null)

    const finishExerciseMutation = useMutation(
        (nothing: null) =>
            updateExerciseDetails({
                ...thisExercise,
                slugName: exerciseSlugName,
                sets: [...thisExercise.sets, ...setsToday],
            }),
        {
            onMutate: async () => {
                await queryClient.cancelQueries(['exercises', thisExercise.name])
                await queryClient.cancelQueries(['plans', planToken])
            },
            onSettled: () => {
                queryClient.invalidateQueries(['exercises', thisExercise.name])
                queryClient.invalidateQueries(['plans', planToken])
            },
        },
    )

    return (
        <div style={{ width: '100%' }}>
            <Typography.Title level={3}>Last Time</Typography.Title>
            <div style={{ marginBottom: '15px' }}>
                <Typography.Text>
                    {newestSet ? new Date(newestSet.date).toDateString() : 'No Records'}
                </Typography.Text>
                <br />
                {newestSet
                    ? getSetsFromSameSession(newestSet.date, thisExercise).map((s, idx) => (
                          <div key={idx} style={{ fontSize: '32px' }}>
                              {s.reps} @ {thisExercise?.bodyWeight ? 'You' : s.weight}
                          </div>
                      ))
                    : null}
            </div>
            <Typography.Title level={3}>Today's Sets</Typography.Title>
            <List>
                {setsToday.map((s, idx) => (
                    <List.Item key={idx} style={{ fontSize: '32px' }}>
                        {idx + 1}) {s.reps} @ {thisExercise?.bodyWeight ? 'You' : s.weight}
                    </List.Item>
                ))}
            </List>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '450px',
                    height: '100px',
                }}>
                <div>
                    <InputNumber
                        type="number"
                        style={{
                            width: '175px',
                            height: '100px',
                            fontSize: '28px',
                            lineHeight: '100px',
                        }}
                        onClick={e => {
                            setNewReps(null)
                        }}
                        autoFocus
                        value={newReps ?? ''}
                        placeholder="Num reps"
                        onChange={val => setNewReps(val || 0)}
                    />
                </div>
                {thisExercise?.bodyWeight ? null : (
                    <>
                        <div style={{ marginLeft: '5px' }}>
                            <InputNumber
                                type="number"
                                style={{
                                    width: '175px',
                                    height: '100px',
                                    fontSize: '28px',
                                    lineHeight: '100px',
                                }}
                                onClick={e => {
                                    setNewWeight(null)
                                }}
                                value={newWeight ?? ''}
                                placeholder="Weight (lbs)"
                                onChange={val => setNewWeight(val || 0)}
                            />
                        </div>
                    </>
                )}
            </div>
            <div style={{ width: '100%', maxWidth: '450px' }}>
                <Button
                    type="primary"
                    style={{ width: '100%', height: '50px' }}
                    disabled={(!newWeight && !thisExercise?.bodyWeight) || !newReps}
                    onClick={e => {
                        if ((!!newWeight || thisExercise?.bodyWeight) && !!newReps) {
                            setSetsToday([
                                ...setsToday,
                                {
                                    weight: newWeight,
                                    reps: newReps,
                                    date: new Date().toISOString(),
                                },
                            ])
                            setNewReps(0)
                            // leave weight filled out the same, for convenience
                        }
                    }}>
                    Record Set
                </Button>
            </div>
            <Button
                style={{ marginTop: '35px', width: '100%', height: '50px', maxWidth: '450px' }}
                onClick={() => {
                    finishExerciseMutation.mutate(null, {
                        onSuccess: () => {
                            navigate(location.pathname.split('/').slice(0, -1).join('/'))
                        },
                    })
                }}>
                Finish Exercise
            </Button>
            {plan?.token ? (
                <div style={{ marginTop: '25px' }}>
                    <Typography.Title level={4}>Next Up:</Typography.Title>
                    {unfinishedExercisesInPlan.map(e => (
                        <Button
                            onClick={() => {
                                finishExerciseMutation.mutate(null, {
                                    onSuccess: () => {
                                        navigate(
                                            location.pathname.replace(exerciseSlugName, e.slugName),
                                        )
                                    },
                                })
                            }}
                            type="link"
                            style={{
                                lineHeight: '24px',
                                fontSize: '24px',
                                marginLeft: '10px',
                                paddingTop: '15px',
                                paddingBottom: '15px',
                                height: '100%',
                            }}>
                            {e.name}
                        </Button>
                    ))}
                </div>
            ) : null}
        </div>
    )
}

export default Exercise
