import React, { useState, useMemo } from 'react'
import logo from './logo.svg'
import './App.css'

import 'antd/dist/antd.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { Menu, Breadcrumb, Row, Col } from 'antd'
import AdHoc from 'pages/AdHoc/AdHoc.lazy'
import Plans from 'pages/Plans/Plans.lazy'
import PlanDetails from 'pages/PlanDetails/PlanDetails.lazy'
import Exercise from 'pages/Exercise/Exercise.lazy'
import { useCurrentUser } from 'services/firebase'
import LoginPage from 'pages/LoginPage/LoginPage.lazy'
import { logout } from 'services/firebase'
import { usePlans, WorkoutPlan } from 'services/plans_service'
type MenuOptions = 'ad-hoc' | 'plans'
const Header = () => {
    const location = useLocation()
    const { data: plans } = usePlans()
    const plansByToken: Record<string, WorkoutPlan> = useMemo(
        () => plans?.reduce((prev, cur) => ({ ...prev, [cur.token]: cur } ?? {}), {}) ?? {},
        [plans],
    )
    const pathSnippets = location.pathname.split('/').filter(path => !!path)
    const breadCrumbNameByPath: Record<string, string> = {
        plans: 'Plans',
    }
    const getBreadCrumbName = (pathSegment: string) => {
        if (pathSegment.startsWith('P_')) {
            const plan = plansByToken?.[pathSegment]
            return plan?.name ?? 'Unknown Plan'
        } else {
            return breadCrumbNameByPath?.[pathSegment] ?? pathSegment
        }
    }
    const breadCrumbs = pathSnippets.map((seg, idx) => {
        const url = `${pathSnippets.slice(0, idx + 1).join('/')}`
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{getBreadCrumbName(seg) ?? seg}</Link>
            </Breadcrumb.Item>
        )
    })
    const [currentMenuSelection, setCurrentMenuSelection] = useState<MenuOptions>(
        (location.pathname.split('/')[1] || 'ad-hoc') as MenuOptions,
    )
    return (
        <>
            <Row>
                <Col span={6} offset={8}>
                    <Menu
                        mode="horizontal"
                        selectedKeys={[currentMenuSelection]}
                        onClick={e => setCurrentMenuSelection(e.key as MenuOptions)}>
                        <Menu.Item key="ad-hoc">
                            <Link to="ad-hoc">Ad Hoc</Link>
                        </Menu.Item>
                        <Menu.Item key="plans">
                            <Link to="plans">Plans</Link>
                        </Menu.Item>
                    </Menu>
                </Col>
                <Col span={2} offset={8}>
                    <Menu>
                        <Menu.Item
                            key="logout"
                            onClick={() => {
                                logout()
                            }}>
                            Logout
                        </Menu.Item>
                    </Menu>
                </Col>
            </Row>
            <div style={{ marginLeft: '5%', marginBottom: '15px' }}>
                <Breadcrumb>
                    {[
                        <Breadcrumb.Item key="home">
                            <Link to="/">Home</Link>
                        </Breadcrumb.Item>,
                    ].concat(breadCrumbs)}
                </Breadcrumb>
            </div>
        </>
    )
}

const App = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 1000 } } })
    return (
        <QueryClientProvider client={queryClient}>
            <ActualApp />
        </QueryClientProvider>
    )
}

const ActualApp = () => {
    const user = useCurrentUser()
    if (user === null) {
        return <LoginPage />
    }
    const baseName = process.env.publicUrl
    return (
        <BrowserRouter basename={baseName ? baseName : undefined}>
            <Header />
            <Routes>
                <Route path="/">
                    <Route index element={<AdHoc />}></Route>
                    <Route path="ad-hoc" element={<AdHoc />}></Route>
                    <Route path="plans" element={<Plans />}></Route>
                    <Route path="plans/:token" element={<PlanDetails />} />
                    <Route path="plans/:token/:name" element={<Exercise />} />
                    <Route path="exercise/:name" element={<Exercise />} />
                    <Route path="exercise" element={<Navigate replace to="/" />}></Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
