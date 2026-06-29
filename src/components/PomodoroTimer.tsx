import { useEffect, useMemo, useRef, useState } from 'react'
import { Minus, Pause, Play, Plus, RotateCcw, Settings, X } from 'lucide-react'

interface PomodoroTimerProps {
  open: boolean
  onClose: () => void
}

type Mode = 'focus' | 'short' | 'long'

const MODES: { id: Mode; label: string; minutes: number }[] = [
  { id: 'focus', label: 'Focus', minutes: 25 },
  { id: 'short', label: 'Short break', minutes: 5 },
  { id: 'long', label: 'Long break', minutes: 15 },
]

const DEFAULT_DURATIONS: Record<Mode, number> = {
  focus: 25,
  short: 5,
  long: 15,
}

const MIN_MINUTES = 1
const MAX_MINUTES = 90

function format(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function Ring({ percent }: { percent: number }) {
  const size = 240
  const stroke = 14
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#eef1f8"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#2f6bff"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className="transition-[stroke-dashoffset] duration-500 ease-linear"
      />
    </svg>
  )
}

export function PomodoroTimer({ open, onClose }: PomodoroTimerProps) {
  const [durations, setDurations] = useState<Record<Mode, number>>(DEFAULT_DURATIONS)
  const [mode, setMode] = useState<Mode>('focus')
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_DURATIONS.focus * 60)
  const [running, setRunning] = useState(false)
  const [completedFocus, setCompletedFocus] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = durations[mode] * 60
  const percent = useMemo(
    () => Math.round(((total - secondsLeft) / total) * 100),
    [total, secondsLeft],
  )

  const selectMode = (next: Mode) => {
    setMode(next)
    setSecondsLeft(durations[next] * 60)
    setRunning(false)
  }

  const reset = () => {
    setSecondsLeft(durations[mode] * 60)
    setRunning(false)
  }

  const setMinutes = (target: Mode, minutes: number) => {
    const clamped = Math.min(MAX_MINUTES, Math.max(MIN_MINUTES, minutes))
    setDurations((prev) => ({ ...prev, [target]: clamped }))
    // Keep the visible countdown in sync when tweaking the current mode.
    if (target === mode && !running) setSecondsLeft(clamped * 60)
  }

  // Drive the countdown while running.
  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false)
          if (mode === 'focus') setCompletedFocus((c) => c + 1)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, mode])

  if (!open) return null

  const finished = secondsLeft === 0

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative w-full max-w-md rounded-t-3xl bg-white p-6 shadow-card sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-ink">
            {settingsOpen ? 'Timer settings' : 'Pomodoro'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSettingsOpen((s) => !s)}
              aria-label="Timer settings"
              aria-pressed={settingsOpen}
              className={`grid h-9 w-9 place-items-center rounded-full transition active:scale-95 ${
                settingsOpen ? 'bg-accent text-white' : 'bg-canvas text-ink'
              }`}
            >
              <Settings className="h-5 w-5" strokeWidth={2.4} />
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="grid h-9 w-9 place-items-center rounded-full bg-canvas text-ink transition active:scale-95"
            >
              <X className="h-5 w-5" strokeWidth={2.4} />
            </button>
          </div>
        </div>

        {settingsOpen ? (
          <div className="mt-6 flex flex-col gap-3">
            {MODES.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-2xl bg-canvas px-4 py-3"
              >
                <span className="text-[15px] font-bold text-ink">{m.label}</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMinutes(m.id, durations[m.id] - 1)}
                    disabled={durations[m.id] <= MIN_MINUTES}
                    aria-label={`Decrease ${m.label}`}
                    className="grid h-8 w-8 place-items-center rounded-full bg-white text-ink shadow-card transition active:scale-95 disabled:opacity-40"
                  >
                    <Minus className="h-4 w-4" strokeWidth={2.6} />
                  </button>
                  <span className="w-14 text-center text-[15px] font-bold tabular-nums text-ink">
                    {durations[m.id]} min
                  </span>
                  <button
                    type="button"
                    onClick={() => setMinutes(m.id, durations[m.id] + 1)}
                    disabled={durations[m.id] >= MAX_MINUTES}
                    aria-label={`Increase ${m.label}`}
                    className="grid h-8 w-8 place-items-center rounded-full bg-white text-ink shadow-card transition active:scale-95 disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" strokeWidth={2.6} />
                  </button>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => setSettingsOpen(false)}
              className="mt-2 w-full rounded-2xl bg-accent py-3.5 text-[16px] font-bold text-white shadow-fab transition active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mt-5 flex justify-center gap-2">
              {MODES.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => selectMode(m.id)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-bold transition ${
                    mode === m.id ? 'bg-accent text-white' : 'bg-canvas text-muted'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <div className="relative grid place-items-center">
                <Ring percent={percent} />
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-extrabold tabular-nums text-ink">
                    {format(secondsLeft)}
                  </span>
                  <span className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                    {finished ? 'Done!' : running ? 'In progress' : 'Paused'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                aria-label="Reset"
                className="grid h-12 w-12 place-items-center rounded-full bg-canvas text-ink transition active:scale-95"
              >
                <RotateCcw className="h-5 w-5" strokeWidth={2.4} />
              </button>

              <button
                type="button"
                onClick={() => setRunning((r) => !r)}
                disabled={finished}
                className="flex h-14 flex-1 items-center justify-center gap-2 rounded-2xl bg-accent text-[16px] font-bold text-white shadow-fab transition active:scale-[0.98] disabled:opacity-40 disabled:shadow-none"
              >
                {running ? (
                  <>
                    <Pause className="h-5 w-5" strokeWidth={2.6} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" strokeWidth={2.6} />
                    Start
                  </>
                )}
              </button>
            </div>

            <p className="mt-4 text-center text-sm font-medium text-muted">
              {completedFocus} focus session{completedFocus === 1 ? '' : 's'} completed
            </p>
          </>
        )}
      </div>
    </div>
  )
}
