import { motion, useReducedMotion } from 'framer-motion'
import { FloatOrnaments } from '../components/home/FloatOrnaments'
import { HeroCollage } from '../components/home/HeroCollage'
import { SkillStack } from '../components/home/SkillStack'
import { SolidStar } from '../components/ui/SolidStar'
import './Home.css'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export function Home() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className="home"
      initial={reduceMotion ? false : 'hidden'}
      animate="show"
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: 0.1, delayChildren: 0.06 },
        },
      }}
    >
      <FloatOrnaments />
      <div className="home__inner">
        <div className="home__left">
          <motion.p className="home__status" variants={fadeUp}>
            <span className="home__status-dot" aria-hidden />
            online // portfolio_v0.1
          </motion.p>
          <motion.div className="home__hook" variants={fadeUp}>
            <h1 className="home__name">
              Cla
              <span className="home__i">
                <span className="home__i-letter">i</span>
                <span className="home__i-star" aria-hidden>
                  <SolidStar tone="ink" />
                </span>
              </span>
              re
            </h1>
            <p className="home__role">
              <span className="home__role-verb">does</span>
              <span className="home__hl">product design</span>
            </p>
          </motion.div>
          <motion.div className="home__also" variants={fadeUp}>
            <p className="home__also-label" id="skills-label">
              she also does
            </p>
            <SkillStack labelledBy="skills-label" />
          </motion.div>
        </div>
        <motion.div className="home__collage" variants={fadeUp}>
          <HeroCollage />
        </motion.div>
      </div>
    </motion.section>
  )
}
