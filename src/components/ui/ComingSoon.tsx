import './ComingSoon.css'

type ComingSoonProps = {
  file: string
  path: string
}

export function ComingSoon({ file, path }: ComingSoonProps) {
  return (
    <section className="coming-soon">
      <div className="coming-soon__window">
        <div className="coming-soon__bar">
          <div className="coming-soon__dots" aria-hidden>
            <span />
            <span />
            <span />
          </div>
          <span className="coming-soon__file">{file}</span>
        </div>
        <div className="coming-soon__body">
          <p className="coming-soon__path">{path}</p>
          <p className="coming-soon__hint">this folder is empty — check back soon</p>
        </div>
      </div>
    </section>
  )
}