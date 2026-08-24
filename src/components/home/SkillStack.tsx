import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { SKILLS, type Skill } from '../../data/skills'
import './SkillStack.css'

const INTERVAL_MS = 2800
const MAX_VISIBLE = 6
const MAX_VISIBLE_MOBILE = 5

type StackItem = {
  id: number
  skill: Skill
}

function seedStack(maxVisible: number): StackItem[] {
  return Array.from({ length: maxVisible }, (_, i) => ({
    id: -i,
    skill: SKILLS[(SKILLS.length - i) % SKILLS.length],
  }))
}

function fadedStyle(index: number) {
  const opacity = [1, 0.58, 0.4, 0.26, 0.14, 0.06][index] ?? 0.04
  const scale = [1, 0.985, 0.97, 0.955, 0.94, 0.925][index] ?? 0.91
  return { opacity, scale }
}

function SkillRow({ skill, active }: { skill: Skill; active: boolean }) {
  return <span>{active ? `[ ${skill} ]` : skill}</span>
}

export function SkillStack({ labelledBy }: { labelledBy?: string }) {
  const reduceMotion = useReducedMotion()
  const [tick, setTick] = useState(0)
  const [items, setItems] = useState<StackItem[]>(() => seedStack(MAX_VISIBLE))
  const maxVisibleRef = useRef(MAX_VISIBLE)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 520px)')
    const sync = () => {
      const next = media.matches ? MAX_VISIBLE_MOBILE : MAX_VISIBLE
      maxVisibleRef.current = next
      setItems((prev) => {
        if (prev.length >= next) return prev.slice(0, next)
        return seedStack(next)
      })
    }
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTick((value) => value + 1)
    }, INTERVAL_MS)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (tick === 0) return
    const nextSkill = SKILLS[tick % SKILLS.length]
    setItems((prev) =>
      [{ id: tick, skill: nextSkill }, ...prev].slice(0, maxVisibleRef.current),
    )
  }, [tick])

  const activeSkill = reduceMotion
    ? SKILLS[tick % SKILLS.length]
    : (items[0]?.skill ?? SKILLS[0])

  if (reduceMotion) {
    return (
      <div className="skill-stack skill-stack--static" aria-labelledby={labelledBy}>
        <p className="visually-hidden" aria-live="polite">
          {activeSkill}
        </p>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSkill}
            className="skill-stack__item is-active"
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <SkillRow skill={activeSkill} active />
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="skill-stack" aria-labelledby={labelledBy}>
      <p className="visually-hidden" aria-live="polite">
        {activeSkill}
      </p>
      <AnimatePresence initial={false}>
        {items.map((item, index) => {
          const faded = fadedStyle(index)
          return (
            <motion.div
              key={item.id}
              layout
              aria-hidden
              className={index === 0 ? 'skill-stack__item is-active' : 'skill-stack__item'}
              initial={{ opacity: 0, y: -18, scale: 0.96 }}
              animate={{ opacity: faded.opacity, y: 0, scale: faded.scale }}
              exit={{ opacity: 0, y: 18, scale: 0.9 }}
              transition={{
                layout: { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 },
                opacity: { duration: 0.35 },
                y: { type: 'spring', stiffness: 380, damping: 22 },
              }}
            >
              <SkillRow skill={item.skill} active={index === 0} />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
