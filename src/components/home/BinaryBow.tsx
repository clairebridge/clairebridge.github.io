import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import './BinaryBow.css'

const GLYPHS: Record<string, string[]> = {
  P: ['11110', '10001', '11110', '10000', '10000'],
  R: ['11110', '10001', '11110', '10100', '10010'],
  O: ['01110', '10001', '10001', '10001', '01110'],
  B: ['11110', '10001', '11110', '10001', '11110'],
  L: ['10000', '10000', '10000', '10000', '11111'],
  E: ['11111', '10000', '11110', '10000', '11111'],
  M: ['10001', '11011', '10101', '10001', '10001'],
  S: ['01111', '10000', '01110', '00001', '11110'],
  V: ['10001', '10001', '01010', '01010', '00100'],
}

function encodePixel(on: boolean, x: number, y: number) {
  if (!on) return ' '
  return (x + y) % 2 === 0 ? '1' : '0'
}

function renderWord(word: string, rowOffset: number) {
  const letters = word.split('').map((char) => GLYPHS[char] ?? GLYPHS.O)
  const rows: string[] = []

  for (let y = 0; y < 5; y += 1) {
    const parts: string[] = []
    let x = 0
    letters.forEach((glyph, index) => {
      if (index > 0) {
        parts.push(' ')
        x += 1
      }
      parts.push(
        glyph[y]
          .split('')
          .map((bit) => encodePixel(bit === '1', x++, y + rowOffset))
          .join(''),
      )
    })
    rows.push(parts.join(''))
  }

  return rows
}

function centerRow(row: string, width: number) {
  const pad = Math.max(0, Math.floor((width - row.length) / 2))
  return `${' '.repeat(pad)}${row}`
}

const PROBLEM = renderWord('PROBLEM', 0)
const SOLVER = renderWord('SOLVER', 6)
const WIDTH = Math.max(PROBLEM[0].length, SOLVER[0].length)
const TEXT = [...PROBLEM.map((row) => centerRow(row, WIDTH)), '', ...SOLVER.map((row) => centerRow(row, WIDTH))].join(
  '\n',
)

function flicker(source: string) {
  return source.replace(/[01]/g, (bit) =>
    Math.random() > 0.78 ? (bit === '0' ? '1' : '0') : bit,
  )
}

export function BinaryBow() {
  const reduceMotion = useReducedMotion()
  const [art, setArt] = useState(TEXT)

  useEffect(() => {
    if (reduceMotion) {
      setArt(TEXT)
      return
    }

    const timer = window.setInterval(() => {
      setArt(flicker(TEXT))
    }, 90)

    return () => window.clearInterval(timer)
  }, [reduceMotion])

  return (
    <div className="binary-bow" aria-hidden>
      <pre className="binary-bow__art">{art}</pre>
    </div>
  )
}
