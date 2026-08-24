import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import './LandingCursor.css'

const TRAIL_COUNT = 10
const SPARK_COUNT = 22
const TONES = ['ink', 'lavender', 'sticky', 'blush', 'sky'] as const

type Spark = {
  active: boolean
  x: number
  y: number
  vx: number
  vy: number
  life: number
  decay: number
  size: number
  rot: number
  spin: number
  kind: 'star' | 'spark' | 'dust'
  tone: (typeof TONES)[number]
}

function makeSparks(): Spark[] {
  return Array.from({ length: SPARK_COUNT }, () => ({
    active: false,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    life: 0,
    decay: 0.02,
    size: 1,
    rot: 0,
    spin: 0,
    kind: 'star' as const,
    tone: 'lavender' as const,
  }))
}

function CursorMark() {
  return (
    <svg viewBox="0 0 32 40" aria-hidden>
      <path
        className="landing-cursor__body"
        d="M2.4 1.6 2.8 33.2 11 24.6 16.6 38.2 23.8 35.2 17.6 21.2 29.2 20.6Z"
      />
      <path
        className="landing-cursor__shine"
        d="M6.2 8.4 6.4 24.8 11.4 19.6 14.8 28.2 18.4 26.6 14.6 17.6 21.6 17.2Z"
      />
    </svg>
  )
}

function StarMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <polygon
        points="8,0 9.1,6.2 16,8 9.1,9.8 8,16 6.9,9.8 0,8 6.9,6.2"
        fill="currentColor"
      />
    </svg>
  )
}

function SparkMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path
        fill="currentColor"
        d="M8 0.4 8.85 6.4 15.6 8 8.85 9.6 8 15.6 7.15 9.6 0.4 8 7.15 6.4Z"
      />
    </svg>
  )
}

export function LandingCursor() {
  const reduceMotion = useReducedMotion()
  const [on, setOn] = useState(false)
  const [finePointer, setFinePointer] = useState(false)

  const leadRef = useRef<HTMLDivElement>(null)
  const trailRefs = useRef<(HTMLSpanElement | null)[]>([])
  const sparkRefs = useRef<(HTMLSpanElement | null)[]>([])

  const mouse = useRef({ x: 0, y: 0 })
  const lead = useRef({ x: 0, y: 0, scale: 1 })
  const trail = useRef(Array.from({ length: TRAIL_COUNT }, () => ({ x: 0, y: 0 })))
  const sparks = useRef(makeSparks())
  const hover = useRef(false)
  const wasHover = useRef(false)
  const seeded = useRef(false)
  const travel = useRef(0)
  const last = useRef({ x: 0, y: 0 })
  const trailGlow = useRef(0)
  const raf = useRef(0)

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)')
    const sync = () => setFinePointer(media.matches)
    sync()
    media.addEventListener('change', sync)

    const move = (event: PointerEvent) => {
      mouse.current.x = event.clientX
      mouse.current.y = event.clientY
      if (!seeded.current) {
        seeded.current = true
        lead.current.x = event.clientX
        lead.current.y = event.clientY
        last.current.x = event.clientX
        last.current.y = event.clientY
        for (const point of trail.current) {
          point.x = event.clientX
          point.y = event.clientY
        }
      }
      setOn(true)
      const target = event.target
      hover.current = Boolean(
        target instanceof Element &&
          target.closest(
            'a, button, summary, [role="button"], [role="link"], .float-pin, .float-ornament:not(.float-ornament--idle)',
          ),
      )
    }

    window.addEventListener('pointermove', move)
    return () => {
      media.removeEventListener('change', sync)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const enable = on && finePointer && !reduceMotion
    root.classList.toggle('has-star-cursor', enable)
    return () => root.classList.remove('has-star-cursor')
  }, [on, finePointer, reduceMotion])

  useEffect(() => {
    if (reduceMotion || !finePointer || !on) return

    const spawn = (burst = false, heading = 0) => {
      const slot = sparks.current.find((spark) => !spark.active)
      if (!slot) return

      const angle = burst
        ? Math.random() * Math.PI * 2
        : heading + Math.PI + (Math.random() - 0.5) * 1.1
      const speed = burst ? 1.1 + Math.random() * 2.4 : 0.35 + Math.random() * 1.35
      const roll = Math.random()
      slot.active = true
      slot.x = lead.current.x + 8 + (Math.random() - 0.5) * (burst ? 18 : 8)
      slot.y = lead.current.y + 10 + (Math.random() - 0.5) * (burst ? 18 : 8)
      slot.vx = Math.cos(angle) * speed
      slot.vy = Math.sin(angle) * speed - (burst ? 0.8 : 0.2)
      slot.life = 1
      slot.decay = burst ? 0.018 + Math.random() * 0.016 : 0.02 + Math.random() * 0.018
      slot.size = burst ? 0.55 + Math.random() * 0.75 : 0.32 + Math.random() * 0.5
      slot.rot = Math.random() * 360
      slot.spin = (Math.random() - 0.5) * 10
      slot.kind = roll > 0.62 ? 'star' : roll > 0.28 ? 'spark' : 'dust'
      slot.tone = TONES[1 + Math.floor(Math.random() * (TONES.length - 1))]
    }

    const tick = () => {
      const nextScale = hover.current ? 1.16 : 1
      lead.current.scale += (nextScale - lead.current.scale) * 0.18
      const catchUp = hover.current ? 0.4 : 0.32
      lead.current.x += (mouse.current.x - lead.current.x) * catchUp
      lead.current.y += (mouse.current.y - lead.current.y) * catchUp

      let prevX = lead.current.x + 8
      let prevY = lead.current.y + 12
      for (let i = 0; i < TRAIL_COUNT; i += 1) {
        const ease = 0.26 - i * 0.014
        trail.current[i].x += (prevX - trail.current[i].x) * ease
        trail.current[i].y += (prevY - trail.current[i].y) * ease
        prevX = trail.current[i].x
        prevY = trail.current[i].y
      }

      const dx = mouse.current.x - last.current.x
      const dy = mouse.current.y - last.current.y
      const speed = Math.hypot(dx, dy)
      const heading = speed > 0.2 ? Math.atan2(dy, dx) : 0
      last.current.x = mouse.current.x
      last.current.y = mouse.current.y
      travel.current += speed

      if (hover.current && !wasHover.current) {
        for (let i = 0; i < 8; i += 1) spawn(true)
      }
      wasHover.current = hover.current

      const gap = hover.current ? 9 : 16
      while (travel.current > gap) {
        spawn(false, heading)
        travel.current -= gap
      }

      const leadEl = leadRef.current
      if (leadEl) {
        leadEl.style.transform = `translate3d(${lead.current.x}px, ${lead.current.y}px, 0) scale(${lead.current.scale})`
      }

      const targetGlow = Math.min(1, speed / 7 + (hover.current ? 0.42 : 0.16))
      trailGlow.current += (targetGlow - trailGlow.current) * 0.18
      const trailAlpha = trailGlow.current
      for (let i = 0; i < TRAIL_COUNT; i += 1) {
        const el = trailRefs.current[i]
        if (!el) continue
        const fade = (1 - (i + 1) / (TRAIL_COUNT + 1)) * trailAlpha
        const size = 1 - i * 0.07
        el.style.opacity = String(fade)
        el.style.transform = `translate3d(${trail.current[i].x}px, ${trail.current[i].y}px, 0) translate(-50%, -50%) rotate(${i * 18}deg) scale(${size})`
      }

      for (let i = 0; i < SPARK_COUNT; i += 1) {
        const spark = sparks.current[i]
        const el = sparkRefs.current[i]
        if (!el) continue
        if (!spark.active) {
          el.style.opacity = '0'
          continue
        }
        spark.x += spark.vx
        spark.y += spark.vy
        spark.vy += 0.03
        spark.vx *= 0.985
        spark.rot += spark.spin
        spark.life -= spark.decay
        if (spark.life <= 0) {
          spark.active = false
          el.style.opacity = '0'
          continue
        }
        el.dataset.tone = spark.tone
        el.dataset.kind = spark.kind
        const pop = spark.life > 0.7 ? spark.size * (1.15 - (1 - spark.life) * 0.4) : spark.size * spark.life
        el.style.opacity = String(Math.min(1, spark.life * 1.15))
        el.style.transform = `translate3d(${spark.x}px, ${spark.y}px, 0) translate(-50%, -50%) rotate(${spark.rot}deg) scale(${pop})`
      }

      raf.current = window.requestAnimationFrame(tick)
    }

    raf.current = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(raf.current)
  }, [on, finePointer, reduceMotion])

  if (reduceMotion || !finePointer || !on) return null

  return (
    <div className="landing-cursor" aria-hidden>
      {Array.from({ length: TRAIL_COUNT }, (_, index) => (
        <span
          key={`trail-${index}`}
          className={`landing-cursor__trail is-${TONES[index % TONES.length]}`}
          ref={(node) => {
            trailRefs.current[index] = node
          }}
        >
          <StarMark />
        </span>
      ))}
      {Array.from({ length: SPARK_COUNT }, (_, index) => (
        <span
          key={`spark-${index}`}
          className="landing-cursor__spark"
          ref={(node) => {
            sparkRefs.current[index] = node
          }}
        >
          <StarMark />
          <SparkMark />
          <i />
        </span>
      ))}
      <div className="landing-cursor__lead" ref={leadRef}>
        <CursorMark />
      </div>
    </div>
  )
}
