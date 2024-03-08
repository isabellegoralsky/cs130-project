import { Link, useMatch, useResolvedPath } from "react-router-dom"
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title nav-link">Home</Link>
      <CustomLink to="/teams" class="nav-link">Teams</CustomLink>
      <CustomLink to="/login" class="nav-link">Login</CustomLink>
      <CustomLink to="/goals" class="nav-link">Goals</CustomLink>
      <CustomLink to="/profile" class="nav-link">Profile</CustomLink>
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