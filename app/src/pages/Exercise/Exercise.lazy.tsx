import React, { lazy, Suspense } from 'react'
import { ExerciseProps } from './Exercise'
const LazyExercise = lazy(() => import('./Exercise'))

const Exercise = (
    props: JSX.IntrinsicAttributes & { children?: React.ReactNode } & ExerciseProps,
) => (
    <Suspense fallback={null}>
        <LazyExercise {...props} />
    </Suspense>
)

export default Exercise
