import React from 'react'
import { useExercises, ExerciseInfo } from 'services/exercise_service'
import { Card, Typography, Checkbox } from 'antd'
import { Link } from 'react-router-dom'
import { AddNewExercise } from 'pages/PlanDetails/PlanDetails'

interface ExerciseCardProps {
    exercise: ExerciseInfo
}
const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
    return (
        <Link
            key={exercise.name}
            to={`/exercise/${exercise.slugName}`}
            style={{ display: 'inline-block', width: '350px', margin: '25px' }}>
            <Card title={exercise.name}>
                <Checkbox
                    disabled={true}
                    style={{ marginRight: '5px' }}
                    checked={exercise?.bodyWeight ?? false}
                />
                Body Weight Exercise
            </Card>
        </Link>
    )
}

export interface AdHocProps {}

const AdHoc = ({}: AdHocProps) => {
    const { data: exercises } = useExercises()

    return (
        <div style={{ width: '90%', margin: 'auto', marginBottom: '25px' }}>
            <Typography.Title>Choose Exercise</Typography.Title>
            {exercises
                ?.sort((a, b) => a.name.localeCompare(b.name))
                ?.map(e => (
                    <ExerciseCard exercise={e} key={e.slugName} />
                ))}
            <AddNewExercise />
        </div>
    )
}

export default AdHoc
