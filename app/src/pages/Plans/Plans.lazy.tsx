import React, { lazy, Suspense } from 'react'
import { PlansProps } from './Plans'
const LazyPlans = lazy(() => import('./Plans'))

const Plans = (
    props: JSX.IntrinsicAttributes & { children?: React.ReactNode } & PlansProps,
) => (
    <Suspense fallback={null}>
        <LazyPlans {...props} />
    </Suspense>
)

export default Plans
