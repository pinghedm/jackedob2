import React from 'react'
import { useParams } from 'react-router-dom'
import { getPlanDetails } from 'services/plans_service'
import { useNavigate, Link } from 'react-router-dom'
import { Typography, Card } from 'antd'
import { cheapSlugify } from 'services/utils'
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
            {plan.exercises.map(e => (
                <Link
                    key={e.name}
                    to={`/plans/${plan.token}/${cheapSlugify(e.name)}`}
                    style={{ display: 'inline-block', width: '350px' }}>
                    <Card title={e.name}>
                        Last Data: {new Date(e.lastTime.date).toDateString()}
                        <br />
                        <br />
                        {e.lastTime.sets.map((s, idx) => (
                            <Typography.Text key={idx}>
                                - {s.reps} @ {s.weight}
                                <br />
                            </Typography.Text>
                        ))}
                    </Card>
                </Link>
            ))}
        </>
    )
}

export default PlanDetails
