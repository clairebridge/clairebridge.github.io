import { NavLink } from 'react-router-dom'
import { LogoMark, LogoWordmark } from './Logo'
import { SolidStar } from '../ui/SolidStar'
import './Nav.css'

const LINKS = [
  { to: '/', label: 'home' },
  { to: '/about', label: 'about me' },
  { to: '/work', label: 'my work' },
  { to: '/contact', label: 'contact me' },
] as const

export function Nav() {
  return (
    <header className="nav">
      <NavLink to="/" className="nav__logo" end aria-label="Claire Does Design, home">
        <LogoMark />
        <LogoWordmark />
      </NavLink>
      <nav className="nav__links" aria-label="primary">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) =>
              isActive ? 'nav__link is-active' : 'nav__link'
            }
          >
            {({ isActive }) => (
              <>
                {isActive ? (
                  <span className="nav__star" aria-hidden>
                    <SolidStar tone="on-dark" />
                  </span>
                ) : null}
                {link.label}
                {isActive ? (
                  <span className="nav__star" aria-hidden>
                    <SolidStar tone="on-dark" />
                  </span>
                ) : null}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}