import { Outlet, useLocation } from 'react-router-dom'
import { Atmosphere } from '../home/Atmosphere'
import { LandingCursor } from '../home/LandingCursor'
import { Footer } from './Footer'
import { Nav } from './Nav'
import './Layout.css'

export function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className={isHome ? 'layout is-home' : 'layout'}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {isHome ? <Atmosphere /> : null}
      <Nav />
      <main id="main-content" className="layout__main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      {isHome ? <LandingCursor /> : null}
    </div>
  )
}
