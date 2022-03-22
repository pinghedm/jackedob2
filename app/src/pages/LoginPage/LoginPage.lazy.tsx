import React, { lazy, Suspense } from 'react'
import { LoginPageProps } from './LoginPage'
const LazyLoginPage = lazy(() => import('./LoginPage'))

const LoginPage = (
    props: JSX.IntrinsicAttributes & { children?: React.ReactNode } & LoginPageProps,
) => (
    <Suspense fallback={null}>
        <LazyLoginPage {...props} />
    </Suspense>
)

export default LoginPage
