import React from 'react'
import { useLocation } from 'react-router-dom'

export interface ExerciseProps {}

const Exercise = ({}: ExerciseProps) => {
    const location = useLocation() // TODO If part of a plan flow, show a 'next' button or something?
    const partOfPlan = location.pathname.includes('plans')
    return (
        <div>
            <div>Last Time</div>
            <div>This time, completed sets</div>
            <div>Input Next Set's Reps</div>
            <div>Input weight [default to last completed]</div>
            <div>Big Submit Button!</div>
            {partOfPlan ? <div>See other exercises in plan</div> : null}
        </div>
    )
}

export default Exercise
