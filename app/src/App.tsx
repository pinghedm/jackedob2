import React from 'react'
import logo from './logo.svg'
import './App.css'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

const Test = () => {
    return <div>Hi I am the Homepage</div>
}

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Test />}></Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
