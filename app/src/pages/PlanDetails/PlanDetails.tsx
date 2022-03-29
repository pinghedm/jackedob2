import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePlanDetails, updatePlan, WorkoutPlan } from 'services/plans_service'
import { Link } from 'react-router-dom'
import { Typography, Card, Input, Button, Checkbox, AutoComplete, Row, Col } from 'antd'
import { mostRecentSet, useExercises, updateExercise } from 'services/exercise_service'
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
        <Row gutter={[16, 16]}>
            <Col xs={{ span: 24 }} lg={{ span: 6 }}>
                <Card>
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
            </Col>
        </Row>
    )
}

interface AddNewExerciseProps {
    plan?: WorkoutPlan
}
export const AddNewExercise = ({ plan }: AddNewExerciseProps) => {
    const { data: exercises } = useExercises()
    const [name, setName] = useState('')
    const [isBodyWeight, setIsBodyWeight] = useState(false)
    const queryClient = useQueryClient()

    const addExerciseMutation = useMutation(
        () => {
            const exercise = { name, slugName: cheapSlugify(name), bodyWeight: isBodyWeight }
            const promises = []
            if (!(exercises ?? []).map(e => e.name).includes(exercise.name)) {
                // create exercise
                const exercisePromise = updateExercise(exercise)
                promises.push(exercisePromise)
            }
            if (plan && !plan.exerciseNames.includes(exercise.name)) {
                const newPlanPromise = updatePlan(plan.token, {
                    ...plan,
                    exerciseNames: [...plan.exerciseNames, exercise.name],
                })
                promises.push(newPlanPromise)
            }
            return Promise.all(promises)
        },
        {
            onMutate: async () => {
                await queryClient.cancelQueries(['exercises'])
                if (plan) {
                    await queryClient.cancelQueries(['plans', plan.token])
                }
            },
            onSettled: () => {
                queryClient.invalidateQueries(['exercises'])
                if (plan) {
                    queryClient.invalidateQueries(['plans', plan.token])
                }
                setName('')
                setIsBodyWeight(false)
            },
        },
    )

    return (
        <Card
            title={
                <Typography.Title level={4}>Add Exercise{plan ? ' To Plan' : ''}</Typography.Title>
            }>
            <div>
                <Checkbox
                    onChange={e => {
                        setIsBodyWeight(e.target.checked)
                    }}
                    style={{ marginRight: '5px' }}
                    checked={isBodyWeight}
                />
                Bodyweight Exercise?
            </div>
            <div>
                <AutoComplete
                    value={name}
                    options={exercises?.map(e => ({ value: e.name }))}
                    onChange={value => {
                        setName(value)
                    }}
                    onSelect={(value: string) => {
                        setName(value)
                    }}>
                    <Input
                        onPressEnter={() => {
                            addExerciseMutation.mutate()
                        }}
                        placeholder="Exercise Name"
                    />
                </AutoComplete>
                <Button
                    disabled={!name}
                    type="primary"
                    style={{ marginTop: '10px' }}
                    onClick={() => {
                        addExerciseMutation.mutate()
                    }}>
                    Add
                </Button>
            </div>
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
            <Row gutter={[16, 16]}>
                {plan.exercises.map(e => {
                    const newestSet = mostRecentSet(e.sets)
                    return (
                        <Col xs={{ span: 24 }} lg={{ span: 6 }} key={e.name}>
                            <Link to={`/plans/${plan.token}/${e.slugName}`}>
                                <Card title={e.name}>
                                    Last Data:{' '}
                                    {newestSet
                                        ? new Date(newestSet?.date ?? '').toDateString()
                                        : 'No Records'}
                                    <br />
                                    <br />
                                    <Typography.Text>
                                        {newestSet
                                            ? `${newestSet?.reps ?? 0} @ ${
                                                  e?.bodyWeight ? 'You' : newestSet.weight
                                              }`
                                            : null}
                                    </Typography.Text>
                                </Card>
                            </Link>
                        </Col>
                    )
                })}
            </Row>
            <Row style={{ marginTop: '32px' }}>
                <Col xs={{ span: 24 }} lg={{ span: 8, offset: 8 }}>
                    <AddNewExercise plan={plan} />
                </Col>
            </Row>
        </>
    )
}

export default PlanDetails
