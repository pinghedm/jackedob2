import React, { lazy, Suspense } from 'react'
import { AdHocProps } from './AdHoc'
const LazyAdHoc = lazy(() => import('./AdHoc'))

const AdHoc = (
    props: JSX.IntrinsicAttributes & { children?: React.ReactNode } & AdHocProps,
) => (
    <Suspense fallback={null}>
        <LazyAdHoc {...props} />
    </Suspense>
)

export default AdHoc
