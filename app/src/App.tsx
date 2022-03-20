import React from 'react'
import logo from './logo.svg'
import './App.css'

import 'antd/dist/antd.css'
import Home from 'pages/Home/Home.lazy'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
