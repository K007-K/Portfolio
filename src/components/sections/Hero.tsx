// Hero section — Signal noise field + intro content (Day 2)
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg)' }}
    >
      <div className="text-center z-10">
        <p
          className="font-mono text-xs uppercase tracking-[0.2em] mb-8"
          style={{ color: 'var(--accent)' }}
        >
          ── Available for Opportunities
        </p>
        <h1
          className="font-display font-extrabold leading-none tracking-tight mb-6"
          style={{
            fontSize: 'clamp(48px, 7vw, 88px)',
            letterSpacing: '-0.03em',
            color: 'var(--text)',
          }}
        >
          Karthik
        </h1>
        <p
          className="font-body font-light text-[22px] max-w-[520px] mx-auto"
          style={{ color: 'var(--muted)' }}
        >
          Developer · Designer · Builder of things people remember.
        </p>
      </div>
    </section>
  )
}
