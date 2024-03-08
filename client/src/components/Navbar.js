import { Link, useMatch, useResolvedPath } from "react-router-dom"
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="nav">
      <Link to="/" className="site-title">
        Home
      </Link>
      <div id="nav-links">
        <CustomLink to="/teams">Teams</CustomLink>
        <CustomLink to="/login">Login</CustomLink>
        <CustomLink to="/register">Register</CustomLink>
        <CustomLink to="/profile">Profile</CustomLink>
        <CustomLink to="/feed">Feed</CustomLink>
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