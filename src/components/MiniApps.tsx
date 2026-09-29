import { useMemo, useState } from 'react'
import {
  Calculator as CalculatorIcon,
  Check,
  Copy,
  ListTodo,
  Minus,
  Palette,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Modal } from './ui/Modal'
import { SectionHeading } from './ui/SectionHeading'

type AppKey = 'counter' | 'todo' | 'calculator' | 'color' | null

export function MiniApps() {
  const { ref, visible } = useScrollReveal()
  const [active, setActive] = useState<AppKey>(null)

  const apps = [
    {
      key: 'counter' as const,
      title: 'Counter',
      description: 'Increase, decrease and reset a simple counter.',
      icon: Plus,
    },
    {
      key: 'todo' as const,
      title: 'To-Do List',
      description: 'Add, complete and delete tasks stored in React state.',
      icon: ListTodo,
    },
    {
      key: 'calculator' as const,
      title: 'Calculator',
      description: 'A functional calculator with numbers, operations and clear.',
      icon: CalculatorIcon,
    },
    {
      key: 'color' as const,
      title: 'Color Generator',
      description: 'Generate a color, view the hex value and copy it.',
      icon: Palette,
    },
  ]

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="miniapps-heading">
      <div ref={ref} className={`mx-auto max-w-7xl reveal ${visible ? 'visible' : ''}`}>
        <SectionHeading
          eyebrow="Playable"
          title="Mini Apps"
          description="Small frontend-only applications that open in glassmorphism windows. Everything stays in the browser."
        />
        <h2 id="miniapps-heading" className="sr-only">
          Mini Apps
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {apps.map((app) => {
            const Icon = app.icon
            return (
              <Card key={app.key} className="flex flex-col">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-slate-950">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-white">{app.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-400">{app.description}</p>
                <Button className="mt-5 w-full" variant="secondary" onClick={() => setActive(app.key)}>
                  Open App
                </Button>
              </Card>
            )
          })}
        </div>
      </div>

      <Modal
        open={active === 'counter'}
        onClose={() => setActive(null)}
        title="Counter"
      >
        <CounterApp />
      </Modal>
      <Modal open={active === 'todo'} onClose={() => setActive(null)} title="To-Do List">
        <TodoApp />
      </Modal>
      <Modal
        open={active === 'calculator'}
        onClose={() => setActive(null)}
        title="Calculator"
      >
        <CalculatorApp />
      </Modal>
      <Modal
        open={active === 'color'}
        onClose={() => setActive(null)}
        title="Color Generator"
      >
        <ColorGeneratorApp />
      </Modal>
    </section>
  )
}

function CounterApp() {
  const [count, setCount] = useState(0)

  return (
    <div className="text-center">
      <p className="text-5xl font-bold text-white tabular-nums">{count}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Button variant="secondary" onClick={() => setCount((c) => c - 1)} aria-label="Decrease">
          <Minus className="h-4 w-4" />
          Decrease
        </Button>
        <Button variant="ghost" onClick={() => setCount(0)} aria-label="Reset">
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>
        <Button variant="primary" onClick={() => setCount((c) => c + 1)} aria-label="Increase">
          <Plus className="h-4 w-4" />
          Increase
        </Button>
      </div>
    </div>
  )
}

interface TodoItem {
  id: string
  text: string
  done: boolean
}

function TodoApp() {
  const [tasks, setTasks] = useState<TodoItem[]>([])
  const [text, setText] = useState('')

  const addTask = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text: trimmed, done: false },
    ])
    setText('')
  }

  return (
    <div>
      <div className="flex gap-2">
        <label className="sr-only" htmlFor="todo-input">
          New task
        </label>
        <input
          id="todo-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTask()
          }}
          placeholder="Add a task..."
          className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
        />
        <Button onClick={addTask} aria-label="Add task">
          Add
        </Button>
      </div>

      {tasks.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-slate-400">
          No tasks yet. Add one to get started.
        </p>
      ) : (
        <ul className="mt-4 space-y-2">
          {tasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2"
            >
              <button
                type="button"
                aria-label={task.done ? 'Mark incomplete' : 'Mark complete'}
                onClick={() =>
                  setTasks((prev) =>
                    prev.map((item) =>
                      item.id === task.id ? { ...item, done: !item.done } : item,
                    ),
                  )
                }
                className={`flex h-7 w-7 items-center justify-center rounded-lg border ${
                  task.done
                    ? 'border-emerald-400/40 bg-emerald-400/20 text-emerald-300'
                    : 'border-white/10 text-slate-400'
                }`}
              >
                <Check className="h-3.5 w-3.5" />
              </button>
              <span
                className={`flex-1 text-sm ${
                  task.done ? 'text-slate-500 line-through' : 'text-slate-200'
                }`}
              >
                {task.text}
              </span>
              <button
                type="button"
                aria-label={`Delete ${task.text}`}
                onClick={() => setTasks((prev) => prev.filter((item) => item.id !== task.id))}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CalculatorApp() {
  const [display, setDisplay] = useState('0')
  const [stored, setStored] = useState<number | null>(null)
  const [op, setOp] = useState<string | null>(null)
  const [fresh, setFresh] = useState(true)

  const inputDigit = (digit: string) => {
    setDisplay((prev) => {
      if (fresh || prev === '0') {
        setFresh(false)
        return digit
      }
      if (prev.length >= 12) return prev
      return prev + digit
    })
  }

  const inputDot = () => {
    setDisplay((prev) => {
      if (fresh) {
        setFresh(false)
        return '0.'
      }
      if (prev.includes('.')) return prev
      return `${prev}.`
    })
  }

  const clearAll = () => {
    setDisplay('0')
    setStored(null)
    setOp(null)
    setFresh(true)
  }

  const applyOp = (nextOp: string) => {
    const current = Number(display)
    if (stored !== null && op && !fresh) {
      const result = compute(stored, current, op)
      setStored(result)
      setDisplay(String(result))
    } else {
      setStored(current)
    }
    setOp(nextOp)
    setFresh(true)
  }

  const equals = () => {
    if (stored === null || !op) return
    const result = compute(stored, Number(display), op)
    setDisplay(String(result))
    setStored(null)
    setOp(null)
    setFresh(true)
  }

  const keys = [
    ['C', '÷', '×', '−'],
    ['7', '8', '9', '+'],
    ['4', '5', '6', '='],
    ['1', '2', '3', '.'],
    ['0'],
  ]

  const handleKey = (key: string) => {
    if (key === 'C') return clearAll()
    if (key === '=') return equals()
    if (key === '.') return inputDot()
    if (['+', '−', '×', '÷'].includes(key)) return applyOp(key)
    inputDigit(key)
  }

  return (
    <div>
      <div
        className="mb-4 rounded-xl border border-white/10 bg-black/40 px-4 py-4 text-right font-mono text-3xl text-white tabular-nums"
        aria-live="polite"
      >
        {display}
      </div>
      <div className="grid gap-2">
        {keys.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-2">
            {row.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleKey(key)}
                className={`rounded-xl border border-white/10 px-3 py-3 text-sm font-medium transition hover:bg-white/10 ${
                  key === '0' ? 'col-span-4' : ''
                } ${
                  ['+', '−', '×', '÷', '='].includes(key)
                    ? 'bg-cyan-400/15 text-cyan-100'
                    : key === 'C'
                      ? 'bg-rose-400/10 text-rose-200'
                      : 'bg-white/5 text-white'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

function compute(a: number, b: number, operator: string) {
  switch (operator) {
    case '+':
      return round(a + b)
    case '−':
      return round(a - b)
    case '×':
      return round(a * b)
    case '÷':
      return b === 0 ? 0 : round(a / b)
    default:
      return b
  }
}

function round(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000
}

function ColorGeneratorApp() {
  const [color, setColor] = useState('#7c3aed')
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const next = `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, '0')}`
    setColor(next)
    setCopied(false)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(color)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const contrast = useMemo(() => {
    const hex = color.replace('#', '')
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.6 ? '#0f172a' : '#f8fafc'
  }, [color])

  return (
    <div>
      <div
        className="mb-4 flex h-40 items-center justify-center rounded-2xl border border-white/10"
        style={{ backgroundColor: color, color: contrast }}
      >
        <span className="font-mono text-xl font-semibold">{color}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button variant="primary" onClick={generate}>
          Generate Color
        </Button>
        <Button variant="secondary" onClick={copy} aria-label="Copy hex value">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy Hex'}
        </Button>
      </div>
    </div>
  )
}
