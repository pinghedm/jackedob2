import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'

import 'antd/dist/antd.css'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { Menu, Breadcrumb } from 'antd'
import AdHoc from 'pages/AdHoc/AdHoc.lazy'
import Plans from 'pages/Plans/Plans.lazy'
import PlanDetails from 'pages/PlanDetails/PlanDetails.lazy'
type MenuOptions = 'ad-hoc' | 'plans'
const Header = () => {
    const location = useLocation()
    const pathSnippets = location.pathname.split('/').filter(path => !!path)
    const breadCrumbNameByPath: Record<string, string> = {
        plans: 'Plans',
    }
    const breadCrumbs = pathSnippets.map((seg, idx) => {
        const url = `${pathSnippets.slice(0, idx + 1).join('/')}`
        return (
            <Breadcrumb.Item key={url}>
                <Link to={url}>{breadCrumbNameByPath?.[url] ?? seg}</Link>
            </Breadcrumb.Item>
        )
    })
    const [currentMenuSelection, setCurrentMenuSelection] = useState<MenuOptions>(
        (location.pathname.split('/')[1] || 'ad-hoc') as MenuOptions,
    )
    return (
        <>
            <div style={{ width: '250px', margin: 'auto' }}>
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
            </div>
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
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/">
                    <Route index element={<AdHoc />}></Route>
                    <Route path="ad-hoc" element={<AdHoc />}></Route>
                    <Route path="plans" element={<Plans />}></Route>
                    <Route path="plans/:token" element={<PlanDetails />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
