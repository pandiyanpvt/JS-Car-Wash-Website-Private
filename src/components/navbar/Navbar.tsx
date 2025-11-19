import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

interface NavbarProps {
  onNavigate?: () => void
  className?: string
}

function Navbar({ onNavigate, className = '' }: NavbarProps) {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { label: 'Home', href: '/', route: true },
    { label: 'Services', href: '/services', route: true },
    { label: 'Contact Us', href: '/contact', route: true },
    { label: 'Our Projects', href: '/gallery', route: true },
    { label: 'Log In', href: '/login', route: true }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname === href
  }

  const handleClick = (href: string) => {
    if (onNavigate) {
      onNavigate()
    }
    navigate(href)
  }

  return (
    <nav className={`modern-navbar ${className}`}>
      <div className="navbar-wrapper">
        {/* Logo Section */}
        <div className="navbar-logo-section">
          <div className="navbar-logo-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
              <path d="M12 15 L12 21 M12 3 L12 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M9 12 L3 12 M21 12 L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8.5 8.5 L5 5 M19 19 L15.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M15.5 8.5 L19 5 M5 19 L8.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="navbar-brand">
            <span className="navbar-brand-main">JS CAR WASH</span>
            <span className="navbar-brand-sub">DETAILING</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="navbar-links">
          {navItems.map((item, index) => {
            const active = isActive(item.href)
            return (
              <Link
                key={index}
                to={item.href}
                className={`navbar-link ${active ? 'navbar-link-active' : ''}`}
                onClick={() => handleClick(item.href)}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        {/* Create Account Button */}
        <Link
          to="/register"
          className="navbar-cta-button"
          onClick={() => {
            if (onNavigate) {
              onNavigate()
            }
            navigate('/register')
          }}
        >
          Create an Account
        </Link>
      </div>
    </nav>
  )
}

export default Navbar
