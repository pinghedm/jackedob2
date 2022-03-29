import React from 'react'
import { useExercises, ExerciseInfo } from 'services/exercise_service'
import { Card, Typography, Row, Col } from 'antd'
import { Link } from 'react-router-dom'
import { AddNewExercise } from 'pages/PlanDetails/PlanDetails'

interface ExerciseCardProps {
    exercise: ExerciseInfo
}
const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
    return (
        <Col xs={{ span: 24 }} lg={{ span: 6 }}>
            <Link key={exercise.name} to={`/exercise/${exercise.slugName}`}>
                <Card>
                    <Typography.Title level={4}>{exercise.name}</Typography.Title>
                </Card>
            </Link>
        </Col>
    )
}

export interface AdHocProps {}

const AdHoc = ({}: AdHocProps) => {
    const { data: exercises } = useExercises()

    return (
        <div>
            <Typography.Title>Choose Exercise</Typography.Title>
            <Row gutter={[16, 16]}>
                {exercises
                    ?.sort((a, b) => a.name.localeCompare(b.name))
                    ?.map(e => (
                        <ExerciseCard exercise={e} key={e.slugName} />
                    ))}
            </Row>
            <Row style={{ marginTop: '32px' }}>
                <Col xs={{ span: 24 }} lg={{ span: 8, offset: 8 }}>
                    <AddNewExercise />
                </Col>
            </Row>
        </div>
    )
}

export default AdHoc
