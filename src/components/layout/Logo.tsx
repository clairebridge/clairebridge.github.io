import { SolidStar } from '../ui/SolidStar'
import './Logo.css'

export function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden>
      <span className="logo-mark__c">C</span>
      <span className="logo-mark__star">
        <SolidStar tone="ink" />
      </span>
    </span>
  )
}

export function LogoWordmark() {
  return (
    <span className="logo-wordmark">
      <span className="logo-wordmark__name">
        Cla
        <span className="logo-wordmark__i">
          <span className="logo-wordmark__i-letter">i</span>
          <span className="logo-wordmark__i-star">
            <SolidStar tone="ink" />
          </span>
        </span>
        re
      </span>
      <span className="logo-wordmark__tag">
        <span className="logo-wordmark__does">does</span>
        <span className="logo-wordmark__design">design</span>
      </span>
    </span>
  )
}
