import './Atmosphere.css'

export function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden>
      <span className="atmosphere__mesh" />
      <span className="atmosphere__grid" />
      <span className="atmosphere__texture" />
    </div>
  )
}
