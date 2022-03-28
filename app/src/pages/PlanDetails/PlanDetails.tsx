import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePlanDetails, updatePlan, WorkoutPlan } from 'services/plans_service'
import { Link } from 'react-router-dom'
import { Typography, Card, Input, Button, Spin, AutoComplete } from 'antd'
import {
    mostRecentSet,
    useExercises,
    ExerciseInfo,
    updateExercise,
    ExerciseDetail,
} from 'services/exercise_service'
import { useMutation, useQueryClient } from 'react-query'
import { cheapSlugify } from 'services/utils'

interface AddNewPlanProps {
    planToken: string
}
const AddNewPlan = ({ planToken }: AddNewPlanProps) => {
    const [name, setName] = useState('')
    const queryClient = useQueryClient()

    const createPlanMutation = useMutation(
        async (name: string) =>
            await updatePlan(planToken, { name, token: planToken, exerciseNames: [] }),
        {
            onMutate: async (name: string) => {
                await queryClient.cancelQueries(['plans', planToken])
            },
            onSettled: () => {
                queryClient.invalidateQueries(['plans', planToken])
            },
        },
    )

    return (
        <Card style={{ width: '50%', margin: 'auto', marginTop: '10%' }}>
            <Typography.Title level={3}>Add New Plan</Typography.Title>
            <Input
                placeholder="Plan Name"
                value={name}
                onChange={e => {
                    setName(e.target.value)
                }}
                onPressEnter={e => {
                    createPlanMutation.mutate(name)
                }}
            />
            <Button
                onClick={() => {
                    createPlanMutation.mutate(name)
                }}
                type="primary"
                style={{ marginTop: '10px' }}
                disabled={!name}>
                Create
            </Button>
        </Card>
    )
}

interface AddNewExerciseProps {
    plan: WorkoutPlan
}
const AddNewExercise = ({ plan }: AddNewExerciseProps) => {
    const { data: exercises } = useExercises()
    const [name, setName] = useState('')
    const queryClient = useQueryClient()

    const addExerciseMutation = useMutation(
        async () => {
            const exercise = { name, slugName: cheapSlugify(name) }
            if (!(exercises ?? []).map(e => e.name).includes(exercise.name)) {
                // create exercise
                await updateExercise(exercise)
            }
            if (!plan.exerciseNames.includes(exercise.name)) {
                const newPlan = await updatePlan(plan.token, {
                    ...plan,
                    exerciseNames: [...plan.exerciseNames, exercise.name],
                })
                return newPlan
            }
            return new Promise((res, rej) => {})
        },
        {
            onMutate: async () => {
                await queryClient.cancelQueries(['exercises'])
                await queryClient.cancelQueries(['plans', plan.token])
            },
            onSettled: () => {
                queryClient.invalidateQueries(['exercises'])
                queryClient.invalidateQueries(['plans', plan.token])
                setName('')
            },
        },
    )

    return (
        <Card
            title={<Typography.Title level={4}>Add Exercise To Plan</Typography.Title>}
            style={{ width: '350px' }}>
            <AutoComplete
                options={exercises?.map(e => ({ value: e.name }))}
                onSelect={(value: string) => {
                    setName(value)
                }}>
                <Input
                    placeholder="Exercise Name"
                    value={name}
                    onChange={e => {
                        setName(e.target.value)
                    }}
                />
            </AutoComplete>
            <Button
                type="primary"
                style={{ marginTop: '10px' }}
                onClick={() => {
                    addExerciseMutation.mutate()
                }}>
                Add
            </Button>
        </Card>
    )
}

export interface PlanDetailsProps {}

const PlanDetails = ({}: PlanDetailsProps) => {
    const params = useParams<{ token: string }>()
    const planToken = params?.token ?? ''
    const plan = usePlanDetails(params?.token ?? '')
    if (!plan?.token) {
        return <AddNewPlan planToken={planToken} />
    }
    return (
        <>
            <Typography.Title>{plan.name}</Typography.Title>
            {plan.exercises.map(e => {
                const newestSet = mostRecentSet(e.sets)
                return (
                    <Link
                        key={e.name}
                        to={`/plans/${plan.token}/${e.slugName}`}
                        style={{ display: 'inline-block', width: '350px' }}>
                        <Card title={e.name}>
                            Last Data:{' '}
                            {newestSet
                                ? new Date(newestSet?.date ?? '').toDateString()
                                : 'No Records'}
                            <br />
                            <br />
                            <Typography.Text>
                                {newestSet
                                    ? `${newestSet?.reps ?? 0} @ ${newestSet?.weight ?? 0}`
                                    : null}
                            </Typography.Text>
                        </Card>
                    </Link>
                )
            })}
            <AddNewExercise plan={plan} />
        </>
    )
}

export default PlanDetails
