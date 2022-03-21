import React from 'react'
import { useParams } from 'react-router-dom'
import { getPlanDetails } from 'services/plans_service'
import { useNavigate, Link } from 'react-router-dom'
import { Typography, Card } from 'antd'
import { mostRecentSet } from 'services/exercise_service'
export interface PlanDetailsProps {}

const PlanDetails = ({}: PlanDetailsProps) => {
    const navigate = useNavigate()
    const params = useParams<{ token: string }>()
    const plan = getPlanDetails(params?.token ?? '')
    if (plan === null) {
        navigate('/plans')
        return null
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
