import React from 'react'
import { Typography, Card, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { usePlans } from 'services/plans_service'
import { Link } from 'react-router-dom'
import { genPlanToken } from 'services/utils'
export interface PlansProps {}

const Plans = ({}: PlansProps) => {
    const { data: plans } = usePlans()
    return (
        <>
            <Typography.Title>Saved Plans</Typography.Title>
            <div style={{ width: '600px', margin: 'auto' }}>
                {plans?.map(plan => (
                    <Link
                        to={plan.token}
                        key={plan.token}
                        style={{ display: 'inline-block', width: '350px' }}>
                        <Card
                            title={plan.name}
                            style={{ maxWidth: '350px', marginTop: '15px' }}
                            key={plan.token}>
                            {plan.exerciseNames.length} exercises.
                        </Card>
                    </Link>
                ))}
                <Button
                    onClick={() => {}}
                    type="link"
                    style={{
                        width: '350px',
                        margin: 'auto',
                        marginTop: '15px',
                        display: 'inline-block',
                    }}>
                    <Link to={genPlanToken()}>
                        <Card style={{ color: 'green' }}>
                            <PlusOutlined />
                            Add new plan
                        </Card>
                    </Link>
                </Button>
            </div>
        </>
    )
}

export default Plans
