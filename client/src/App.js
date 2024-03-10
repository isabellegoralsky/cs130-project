
import Navbar from "./components/Navbar"
import TeamPage from "./components/TeamPage"
import LoginPage from "./components/LoginPage"
import RegisterPage from "./components/RegisterPage"
import ProfilePage from "./components/ProfilePage"
import GoalsPage from "./components/GoalsPage"
import Footer from "./components/Footer"
import { Routes, Route, useLocation, } from "react-router-dom"
import FeedPage from "./components/FeedPage"
import OtherProfilePage from "./components/OtherProfilePage"
function App() {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== '/' && location.pathname !== '/register' && <Navbar />}
      <div className="container">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/teams" element={<TeamPage teams={[]} achievements={[]} updates={[]} posts={[]}/>} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/goals" element={<GoalsPage />} />
          <Route path="/profile/:userId" element={<OtherProfilePage />} />

        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default App