import React from 'react'
import { Typography, Card, Button, Row, Col } from 'antd'
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
            <Row gutter={[16, 16]}>
                {plans?.map(plan => (
                    <Col xs={{ span: 24 }} lg={{ span: 6 }} key={plan.token}>
                        <Link to={plan.token}>
                            <Card
                                title={<Typography.Title level={5}>{plan.name}</Typography.Title>}
                                key={plan.token}>
                                <Typography.Text>
                                    {plan.exerciseNames.length} exercises
                                </Typography.Text>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
            <Row style={{ marginTop: '32px' }}>
                <Col xs={{ span: 24 }} lg={{ span: 8, offset: 8 }}>
                    <Button onClick={() => {}} type="link" style={{ width: '100%' }}>
                        <Link to={genPlanToken()}>
                            <Card style={{ color: 'green' }}>
                                <PlusOutlined />
                                Add new plan
                            </Card>
                        </Link>
                    </Button>
                </Col>
            </Row>
        </>
    )
}

export default Plans
