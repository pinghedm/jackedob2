import React, { lazy, Suspense } from 'react'
import { PlanDetailsProps } from './PlanDetails'
const LazyPlanDetails = lazy(() => import('./PlanDetails'))

const PlanDetails = (
    props: JSX.IntrinsicAttributes & { children?: React.ReactNode } & PlanDetailsProps,
) => (
    <Suspense fallback={null}>
        <LazyPlanDetails {...props} />
    </Suspense>
)

export default PlanDetails
