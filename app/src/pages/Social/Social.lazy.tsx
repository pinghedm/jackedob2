import React, { lazy, Suspense } from 'react'
import { SocialProps } from './Social'
const LazySocial = lazy(() => import('./Social'))

const Social = (
    props: JSX.IntrinsicAttributes & { children?: React.ReactNode } & SocialProps,
) => (
    <Suspense fallback={null}>
        <LazySocial {...props} />
    </Suspense>
)

export default Social
