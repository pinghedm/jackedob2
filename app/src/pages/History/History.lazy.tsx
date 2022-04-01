import React, { lazy, Suspense } from 'react'
import { HistoryProps } from './History'
const LazyHistory = lazy(() => import('./History'))

const History = (
    props: JSX.IntrinsicAttributes & { children?: React.ReactNode } & HistoryProps,
) => (
    <Suspense fallback={null}>
        <LazyHistory {...props} />
    </Suspense>
)

export default History
