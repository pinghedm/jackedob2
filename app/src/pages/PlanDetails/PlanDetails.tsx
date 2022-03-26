import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePlanDetails, updatePlan } from 'services/plans_service'
import { Link } from 'react-router-dom'
import { Typography, Card, Input, Button, Spin } from 'antd'
import { mostRecentSet } from 'services/exercise_service'
import { useMutation, useQueryClient } from 'react-query'

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
                console.log('onmutate')
                await queryClient.cancelQueries(['plans', planToken])
            },
            onSettled: () => {
                console.log(3333333)
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

export interface PlanDetailsProps {}

const PlanDetails = ({}: PlanDetailsProps) => {
    const params = useParams<{ token: string }>()
    const { data: plan, status: planStatus } = usePlanDetails(params?.token ?? '')
    if (planStatus !== 'success') {
        return <Spin />
    }

    if (!plan) {
        return <AddNewPlan planToken={params?.token ?? ''} />
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
                            Last Data: {newestSet ? new Date(newestSet.date).toDateString() : null}
                            <br />
                            <br />
                            <Typography.Text>
                                {newestSet ? `${newestSet.reps} @ ${newestSet.weight}` : null}
                            </Typography.Text>
                        </Card>
                    </Link>
                )
            })}
        </>
    )
}

export default PlanDetails
