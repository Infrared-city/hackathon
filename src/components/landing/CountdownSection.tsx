import { useEffect, useState } from 'react'
import { HACKATHON_START, HACKATHON_END } from '../../lib/config'
import { colors, fonts, sectionStyle } from './tokens'
import { WaitlistForm } from './WaitlistForm'
import { AddToCalendar } from './AddToCalendar'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function calcTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  }
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="countdown-digit" style={{ textAlign: 'center', minWidth: 72 }}>
      <div
        style={{
          background: colors.bgSurface,
          border: `1px solid ${colors.border}`,
          borderRadius: 10,
          padding: '14px 10px',
          fontFamily: fonts.display,
          fontSize: 'clamp(1.75rem, 4vw, 3.25rem)',
          fontWeight: 300,
          color: colors.textH,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          marginBottom: 8,
          minWidth: 72,
        }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: 10,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: colors.text,
        }}
      >
        {label}
      </div>
    </div>
  )
}

interface CountdownSectionProps {
  /** When true, shows a compact inline variant instead of a full section */
  inline?: boolean
}

export function CountdownSection({ inline }: CountdownSectionProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() => calcTimeLeft(HACKATHON_START))
  const isOpen  = Date.now() >= HACKATHON_START.getTime()
  const isEnded = Date.now() >= HACKATHON_END.getTime()

  useEffect(() => {
    if (isOpen) return
    const id = setInterval(() => setTimeLeft(calcTimeLeft(HACKATHON_START)), 1000)
    return () => clearInterval(id)
  }, [isOpen])

  if (isEnded) return null
  if (isOpen)  return null // no countdown after opening

  const launchStr = HACKATHON_START.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  if (inline) {
    return (
      <div
        style={{
          background: 'rgba(35,229,229,0.05)',
          border: `1px solid ${colors.cyanBorder}`,
          borderRadius: 10,
          padding: '20px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: fonts.display,
            color: colors.cyan,
            fontSize: 13,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          Registration opens {launchStr}
        </div>
        {timeLeft && (
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <Digit value={timeLeft.days}    label="days"    />
            <Digit value={timeLeft.hours}   label="hours"   />
            <Digit value={timeLeft.minutes} label="minutes" />
            <Digit value={timeLeft.seconds} label="seconds" />
          </div>
        )}
        <div style={{ marginTop: 20, marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: colors.text, marginBottom: 10, fontFamily: fonts.sans }}>
            Get reminded when registration opens
          </div>
          <WaitlistForm source="getkey" compact />
        </div>
        <AddToCalendar />
      </div>
    )
  }

  return (
    <section
      className="scroll-animate"
      style={{
        ...sectionStyle,
        textAlign: 'center',
        paddingTop: 64,
        paddingBottom: 64,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          color: colors.cyan,
          fontSize: 13,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        Hackathon opens
      </div>
      <h2
        style={{
          fontFamily: fonts.display,
          fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
          fontWeight: 300,
          color: colors.textH,
          marginBottom: 40,
          letterSpacing: '-0.01em',
        }}
      >
        {launchStr}
      </h2>
      {timeLeft && (
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 36 }}>
          <Digit value={timeLeft.days}    label="days"    />
          <Digit value={timeLeft.hours}   label="hours"   />
          <Digit value={timeLeft.minutes} label="minutes" />
          <Digit value={timeLeft.seconds} label="seconds" />
        </div>
      )}
      <div
        style={{
          maxWidth: 520,
          margin: '0 auto',
          padding: '24px 28px',
          background: colors.bgSurface,
          border: `1px solid ${colors.border}`,
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 14, color: colors.textH, marginBottom: 6, fontFamily: fonts.display }}>
          Get the launch email
        </div>
        <div style={{ fontSize: 13, color: colors.text, marginBottom: 16, lineHeight: 1.5 }}>
          We'll send the API key form + Discord invite on May 27. No other emails.
        </div>
        <WaitlistForm source="landing" />
      </div>
      <div style={{ marginTop: 28 }}>
        <AddToCalendar />
      </div>
    </section>
  )
}
