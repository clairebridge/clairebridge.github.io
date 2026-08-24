import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { SolidStar } from '../ui/SolidStar'
import './FloatOrnaments.css'

function Drift({
  className,
  x,
  y,
  distance,
  duration,
  interactive = true,
  children,
}: {
  className: string
  x?: MotionValue<number>
  y?: MotionValue<number>
  distance: number
  duration: number
  interactive?: boolean
  children: ReactNode
}) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div className={className} style={x && y ? { x, y } : undefined}>
      <motion.div
        className={interactive ? 'float-ornament' : 'float-ornament float-ornament--idle'}
        animate={
          reduceMotion
            ? undefined
            : {
                y: -distance,
                x: distance * 0.35,
              }
        }
        transition={{
          duration: duration / 2,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
        }}
        whileHover={
          reduceMotion || !interactive
            ? undefined
            : {
                y: -6,
                scale: 1.06,
                rotate: 2,
                transition: { type: 'spring', stiffness: 320, damping: 18 },
              }
        }
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

function pad(value: number, size = 4) {
  return String(Math.max(0, Math.round(value))).padStart(size, '0')
}

export function FloatOrnaments() {
  const reduceMotion = useReducedMotion()
  const [canParallax, setCanParallax] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 90, damping: 20, mass: 0.5 })
  const y = useSpring(rawY, { stiffness: 90, damping: 20, mass: 0.5 })

  const nearX = useTransform(x, (value) => value * 12)
  const nearY = useTransform(y, (value) => value * 10)
  const midX = useTransform(x, (value) => value * 22)
  const midY = useTransform(y, (value) => value * 16)
  const farX = useTransform(x, (value) => value * 36)
  const farY = useTransform(y, (value) => value * 28)
  const counterX = useTransform(x, (value) => value * -18)
  const counterY = useTransform(y, (value) => value * -14)

  useEffect(() => {
    if (reduceMotion) {
      setCanParallax(false)
      return
    }

    const media = window.matchMedia('(hover: hover) and (pointer: fine)')
    const sync = () => setCanParallax(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [reduceMotion])

  useEffect(() => {
    const move = (event: PointerEvent) => {
      setCoords({ x: event.clientX, y: event.clientY })
      if (!canParallax) return
      rawX.set(event.clientX / window.innerWidth - 0.5)
      rawY.set(event.clientY / window.innerHeight - 0.5)
    }

    window.addEventListener('pointermove', move)
    return () => window.removeEventListener('pointermove', move)
  }, [canParallax, rawX, rawY])

  const spin = (amount: number, duration: number) =>
    reduceMotion
      ? undefined
      : {
          rotate: [0, amount, 0],
          transition: { duration, repeat: Infinity, ease: 'easeInOut' as const },
        }

  const fade = {
    initial: reduceMotion ? false : { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }

  return (
    <>
      <motion.div className="float-field float-field--behind" aria-hidden {...fade}>
        <svg className="float-field__constellation" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M8 78 L46 18 L72 28 L88 16" />
          <path d="M46 18 L58 62" />
          <path d="M72 28 L86 70" />
        </svg>

        <Drift className="float-pos float-pos--swirls-card" distance={5} duration={18.2} interactive={false}>
          <svg className="float-swirls float-swirls--card" viewBox="0 0 360 480" fill="none">
            <path
              className="float-swirls__ribbon"
              d="M292 36c58 42 42 128-18 158-78 40-132-28-86-78 38-42 118-6 96 62-28 86-156 72-188 8-36-74 48-142 118-128 86 18 78 148-18 186-92 36-148 128-72 176 58 36 138-8 128-78"
            />
            <path
              className="float-swirls__ink"
              d="M308 48c48 38 28 122-32 148-86 38-138-42-78-92 44-38 128 8 92 78-40 78-168 58-192-22-28-92 72-148 142-118 64 28 52 138-28 164-94 32-132 118-58 158 62 34 128-22 108-86"
            />
            <path
              className="float-swirls__lilac"
              d="M214 168c42-8 58 42 22 62-48 26-78-28-42-52 22-14 58 6 48 38-16 52-92 48-108 6-18-48 38-78 78-58 28 14 18 68-22 78"
            />
            <path
              className="float-swirls__ink is-fine"
              d="M86 318c62-18 78 64 18 92-54 24-92-38-48-66 26-16 72 10 52 48-22 44-88 28-78-18"
            />
          </svg>
        </Drift>

        <Drift className="float-pos float-pos--swirls-edge" distance={8} duration={15} interactive={false}>
          <svg className="float-swirls float-swirls--edge" viewBox="0 0 220 280" fill="none">
            <path
              className="float-swirls__ribbon is-thin"
              d="M28 42c62-28 128 22 118 78-12 68-108 48-96-8 8-38 72-18 62 28-12 52-92 58-108 12"
            />
            <path
              className="float-swirls__lilac"
              d="M44 58c48-22 96 18 86 62-10 52-86 36-74-10 8-28 58-12 48 24"
            />
            <path
              className="float-swirls__ink is-fine"
              d="M168 128c-38 48-18 112 42 96 28-8 18-54-18-48-22 4-8 42 18 38"
            />
          </svg>
        </Drift>
      </motion.div>

      <motion.div className="float-field" {...fade}>
      <div className="float-field__deco" aria-hidden>
        <span className="float-crop is-tl" />
        <span className="float-crop is-tr" />
        <span className="float-crop is-bl" />
        <span className="float-crop is-br" />

        <Drift className="float-pos float-pos--star-a" x={farX} y={farY} distance={10} duration={8.4}>
          <motion.span className="float-star is-lg" animate={spin(18, 6.5)}>
            <SolidStar tone="ink" />
          </motion.span>
        </Drift>
        <Drift className="float-pos float-pos--star-b" x={midX} y={midY} distance={7} duration={6.8}>
          <motion.span className="float-star is-md is-lilac" animate={spin(-14, 7.2)}>
            <SolidStar tone="ink" />
          </motion.span>
        </Drift>
        <Drift className="float-pos float-pos--star-c" x={counterX} y={counterY} distance={9} duration={9.1}>
          <motion.span className="float-star is-sm" animate={spin(22, 5.4)}>
            <SolidStar tone="ink" />
          </motion.span>
        </Drift>
        <Drift className="float-pos float-pos--star-d" x={farX} y={counterY} distance={6} duration={7.6}>
          <motion.span className="float-star is-md" animate={spin(-10, 8)}>
            <SolidStar tone="ink" />
          </motion.span>
        </Drift>
        <Drift className="float-pos float-pos--star-e" x={nearX} y={farY} distance={8} duration={10}>
          <motion.span className="float-star is-sm is-lilac" animate={spin(16, 6)}>
            <SolidStar tone="ink" />
          </motion.span>
        </Drift>

        <Drift className="float-pos float-pos--select" x={nearX} y={nearY} distance={4} duration={11}>
          <div className="float-select">
            <span className="float-select__handle is-tl" />
            <span className="float-select__handle is-tr" />
            <span className="float-select__handle is-bl" />
            <span className="float-select__handle is-br" />
            <span className="float-select__handle is-t" />
            <span className="float-select__handle is-b" />
            <span className="float-select__handle is-l" />
            <span className="float-select__handle is-r" />
            <span className="float-select__label">Home</span>
          </div>
        </Drift>

        <Drift className="float-pos float-pos--token" x={farX} y={midY} distance={5} duration={9.6}>
          <span className="float-token">
            <i className="float-token__swatch" />
            --lilac
          </span>
        </Drift>

        <Drift className="float-pos float-pos--swatches" x={counterX} y={farY} distance={7} duration={8.2}>
          <div className="float-swatches">
            <i className="is-ink" />
            <i className="is-lilac" />
            <i className="is-deep" />
            <i className="is-paper" />
          </div>
        </Drift>

        <Drift className="float-pos float-pos--spec" x={nearX} y={counterY} distance={3} duration={10.5}>
          <span className="float-spec">artboard · home</span>
        </Drift>

        <div className="float-pos float-pos--hud">
          <span className="float-hud">
            x {pad(coords.x)}
            <br />
            y {pad(coords.y)}
          </span>
        </div>
      </div>

      <Drift className="float-pos float-pos--folder" x={midX} y={counterY} distance={5} duration={7.4}>
        <Link className="float-folder" to="/work" aria-label="Open work">
          <span className="float-folder__tab" />
          <span className="float-folder__body">work/</span>
        </Link>
      </Drift>
      </motion.div>
    </>
  )
}
