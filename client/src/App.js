
import Navbar from "./components/Navbar"
import TeamPage from "./components/TeamPage"
import HomePage from "./components/HomePage"
import LoginPage from "./components/LoginPage"
import RegisterPage from "./components/RegisterPage"
import ProfilePage from "./components/ProfilePage"
import GoalsPage from "./components/GoalsPage"
import Footer from "./components/Footer"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/teams" element={<TeamPage teams={[]} achievements={[]} updates={[]} />} />
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/register" element={<RegisterPage/>}/>
          <Route path="/profile"f element={<ProfilePage/>}/>
          <Route path="/goals" element={<GoalsPage/>}/>
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App