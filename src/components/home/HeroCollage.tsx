import type { PointerEvent, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import {
  motion,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import portrait from '../../assets/images/claire-headshot.png'
import { SolidStar } from '../ui/SolidStar'
import { BinaryBow } from './BinaryBow'
import './HeroCollage.css'

function Placed({
  className,
  x,
  y,
  children,
}: {
  className: string
  x?: MotionValue<number>
  y?: MotionValue<number>
  children: ReactNode
}) {
  return (
    <motion.div className={className} style={x && y ? { x, y } : undefined}>
      {children}
    </motion.div>
  )
}

export function HeroCollage() {
  const reduceMotion = useReducedMotion()
  const [canParallax, setCanParallax] = useState(false)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 120, damping: 18, mass: 0.4 })
  const y = useSpring(rawY, { stiffness: 120, damping: 18, mass: 0.4 })

  const winX = useTransform(x, (value) => value * 10)
  const winY = useTransform(y, (value) => value * 8)
  const bowX = useTransform(x, (value) => value * 22)
  const bowY = useTransform(y, (value) => value * 16)

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

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!canParallax) return
    const rect = event.currentTarget.getBoundingClientRect()
    rawX.set((event.clientX - rect.left) / rect.width - 0.5)
    rawY.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const onLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  const drift = (distance: number) =>
    reduceMotion
      ? undefined
      : {
          y: [0, -distance, 0],
          x: [0, distance * 0.4, 0],
        }

  const driftTransition = (duration: number) => ({
    duration,
    repeat: Infinity,
    ease: 'easeInOut' as const,
  })

  return (
    <div
      className="collage"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <Placed className="collage__layer collage__pos--window" x={winX} y={winY}>
        <div className="collage__stage">
          <div className="collage__window">
            <div className="collage__titlebar">
              <div className="collage__dots" aria-hidden>
                <span />
                <span />
                <span />
              </div>
              <span className="collage__filename">claire.png</span>
            </div>
            <div className="collage__frame">
              <img
                className="collage__portrait"
                src={portrait}
                alt="Portrait of Claire"
              />
            </div>
          </div>
          <div className="collage__pin">
            <div className="float-pin">
              <span className="float-pin__star">
                <SolidStar tone="on-dark" />
              </span>
              <span className="float-pin__card">still iterating</span>
            </div>
          </div>
        </div>
      </Placed>

      <Placed className="collage__layer collage__pos--bow" x={bowX} y={bowY}>
        <motion.div animate={drift(6)} transition={driftTransition(9)}>
          <BinaryBow />
        </motion.div>
      </Placed>
    </div>
  )
}
