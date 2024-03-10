import { Link, useMatch, useResolvedPath } from "react-router-dom"
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="nav">
      <div class="nav-logo-div">
        <img class="nav-logo" src="/gympals_logo.png"/>
      </div>
      <div class="nav-linkss">
        <Link to="/" className="site-title nav-link">Home</Link>
        <CustomLink to="/login" class="nav-link">Login</CustomLink>
        <CustomLink to="/feed" class="nav-link">Feed</CustomLink>
        <CustomLink to="/teams" class="nav-link">Teams</CustomLink>
        <CustomLink to="/goals" class="nav-link">Goals</CustomLink>
        <CustomLink to="/profile" class="nav-link">Profile</CustomLink>
      </div>
    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}