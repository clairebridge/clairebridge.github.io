type SolidStarProps = {
  tone?: 'default' | 'on-dark' | 'ink'
}

export function SolidStar({ tone = 'default' }: SolidStarProps) {
  const fill = tone === 'ink' ? 'currentColor' : '#fff'
  const stroke = tone === 'on-dark' ? '#fff' : tone === 'ink' ? 'currentColor' : 'var(--slate)'

  return (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2.4l2.62 7.92h8.46l-6.85 5.14 2.62 7.92L12 18.1l-6.79 5.28 2.62-7.92-6.85-5.14h8.46L12 2.4z"
        fill={fill}
        stroke={stroke}
        strokeWidth={tone === 'ink' ? 0.6 : 1.1}
        strokeLinejoin="round"
      />
    </svg>
  )
}
