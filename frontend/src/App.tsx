import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
// import { Landing } from './pages/Landing'
import { Signup } from './pages/Signup'
import { Dashboard } from './pages/Dashboard'
import { Sendmoney } from './component/Sendmoney'
import { Login } from './pages/Login'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Signup />}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path='/sendmoney' element={<Sendmoney/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
