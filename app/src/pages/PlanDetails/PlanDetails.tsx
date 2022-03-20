import React from 'react'
import { useParams } from 'react-router-dom'

export interface PlanDetailsProps {}

const PlanDetails = ({}: PlanDetailsProps) => {
    const params = useParams()
    console.log(params)
    return <div>PlanDetails Component</div>
}

export default PlanDetails
