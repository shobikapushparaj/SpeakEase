import React from 'react'
import Signup from './components/Signup'
import Login from './components/Login';
import Body from './components/Body';
import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter ,Routes, Route } from 'react-router-dom'
import UpdateTask from './components/UpdateTask';
import Firstpage from './components/Firstpage';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Firstpage />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/home" element={<Body />} />
          <Route path="/UpdateTask" element={<UpdateTask />} />
        </Routes>
      </BrowserRouter>
      
    </div>
  )
}

export default App