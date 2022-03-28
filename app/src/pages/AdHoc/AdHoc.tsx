import React from 'react'
import { useExercises } from 'services/exercise_service'
import { Card, Typography } from 'antd'
import { Link } from 'react-router-dom'
export interface AdHocProps {}

const AdHoc = ({}: AdHocProps) => {
    const { data: exercises } = useExercises()

    return (
        <div>
            <Typography.Title>Choose Exercise</Typography.Title>
            {exercises?.map(e => (
                <Link
                    key={e.name}
                    to={`exercise/${e.slugName}`}
                    style={{ display: 'inline-block', width: '350px' }}>
                    <Card title={e.name}></Card>
                </Link>
            ))}
        </div>
    )
}

export default AdHoc
