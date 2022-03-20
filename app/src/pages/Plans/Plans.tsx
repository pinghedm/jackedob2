import React from 'react'
import { Typography, Card } from 'antd'
import { getPlans } from 'services/plans_service'
import { Link } from 'react-router-dom'
export interface PlansProps {}

const Plans = ({}: PlansProps) => {
    const plans = getPlans()
    return (
        <>
            <Typography.Title>Saved Plans</Typography.Title>
            <div style={{ width: '600px', margin: 'auto' }}>
                {plans.map(plan => (
                    <Link
                        to={plan.token}
                        key={plan.token}
                        style={{ display: 'inline-block', width: '350px' }}>
                        <Card
                            title={plan.name}
                            style={{ maxWidth: '350px', marginTop: '15px' }}
                            key={plan.token}>
                            {plan.numExercises} exercises.
                            <br />
                            <br />
                            Most recent completion?
                        </Card>
                    </Link>
                ))}
                <Card
                    title="Add new plan"
                    style={{ color: 'green', width: '350px', marginTop: '15px' }}>
                    + New Plan
                </Card>
            </div>
        </>
    )
}

export default Plans
