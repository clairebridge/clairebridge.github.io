import { SolidStar } from '../ui/SolidStar'
import './Footer.css'

export function Footer() {
  return (
    <footer className="site-footer">
      <a className="site-footer__mail" href="mailto:claire@clairedoesdesign.com">
        <span className="site-footer__star" aria-hidden>
          <SolidStar />
        </span>
        claire@clairedoesdesign.com
        <span className="site-footer__star" aria-hidden>
          <SolidStar />
        </span>
      </a>
    </footer>
  )
}
