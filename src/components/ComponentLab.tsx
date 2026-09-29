import { useId, useState, type ReactNode } from 'react'
import { ChevronDown, Info, X } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Card } from './ui/Card'
import { Modal } from './ui/Modal'
import { SectionHeading } from './ui/SectionHeading'

export function ComponentLab() {
  const { ref, visible } = useScrollReveal()
  const [tab, setTab] = useState<'overview' | 'tokens' | 'motion'>('overview')
  const [progress, setProgress] = useState(62)
  const [toggle, setToggle] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>('a1')
  const [modalOpen, setModalOpen] = useState(false)
  const [input, setInput] = useState('')
  const tooltipId = useId()

  return (
    <section
      id="components"
      className="px-4 py-16 sm:px-6 lg:px-8"
      aria-labelledby="components-heading"
    >
      <div ref={ref} className={`mx-auto max-w-7xl reveal ${visible ? 'visible' : ''}`}>
        <SectionHeading
          eyebrow="Library"
          title="Component Lab"
          description="Reusable UI building blocks — interactive where it matters, ready to remix."
        />
        <h2 id="components-heading" className="sr-only">
          Component Lab
        </h2>

        <div className="grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
          <LabItem title="Buttons">
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Primary</Button>
              <Button size="sm" variant="secondary">
                Secondary
              </Button>
              <Button size="sm" variant="aurora">
                Aurora
              </Button>
              <Button size="sm" variant="ghost">
                Ghost
              </Button>
            </div>
          </LabItem>

          <LabItem title="Cards">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium text-white">Nested glass card</p>
              <p className="mt-1 text-xs text-slate-400">Soft surface for content grouping.</p>
            </div>
          </LabItem>

          <LabItem title="Badges">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge tone="cyan">Cyan</Badge>
              <Badge tone="purple">Purple</Badge>
              <Badge tone="pink">Pink</Badge>
            </div>
          </LabItem>

          <LabItem title="Inputs">
            <label className="block">
              <span className="mb-2 block text-xs text-slate-400">Label</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type here..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-400/50"
              />
            </label>
          </LabItem>

          <LabItem title="Tabs">
            <div className="flex gap-1 rounded-xl border border-white/10 bg-black/20 p-1" role="tablist">
              {(['overview', 'tokens', 'motion'] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={tab === item}
                  onClick={() => setTab(item)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs capitalize transition ${
                    tab === item ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Active tab: <span className="text-cyan-300">{tab}</span>
            </p>
          </LabItem>

          <LabItem title="Tooltips">
            <div className="relative inline-flex">
              <button
                type="button"
                aria-describedby={tooltipId}
                className="peer inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
              >
                <Info className="h-4 w-4 text-cyan-300" />
                Hover me
              </button>
              <div
                id={tooltipId}
                role="tooltip"
                className="pointer-events-none absolute bottom-full left-1/2 mb-2 w-40 -translate-x-1/2 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-xs text-slate-300 opacity-0 transition peer-hover:opacity-100 peer-focus-visible:opacity-100"
              >
                Helpful context appears on hover or focus.
              </div>
            </div>
          </LabItem>

          <LabItem title="Progress bars">
            <div className="space-y-3">
              <div
                className="h-2 overflow-hidden rounded-full bg-white/10"
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => setProgress((p) => Math.max(0, p - 10))}>
                  −10
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setProgress((p) => Math.min(100, p + 10))}>
                  +10
                </Button>
              </div>
            </div>
          </LabItem>

          <LabItem title="Toggle">
            <button
              type="button"
              role="switch"
              aria-checked={toggle}
              onClick={() => setToggle((v) => !v)}
              className={`flex h-9 w-[3.75rem] items-center rounded-full border px-1 transition ${
                toggle ? 'border-cyan-400/40 bg-cyan-400/20' : 'border-white/10 bg-white/5'
              }`}
            >
              <span
                className={`h-6 w-6 rounded-full bg-white transition ${
                  toggle ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </LabItem>

          <LabItem title="Accordion">
            <div className="space-y-2">
              {[
                { id: 'a1', title: 'What is this lab?', body: 'A playground of reusable UI pieces.' },
                { id: 'a2', title: 'Are they interactive?', body: 'Yes — tabs, toggles, modals and more.' },
              ].map((item) => {
                const open = openAccordion === item.id
                return (
                  <div key={item.id} className="rounded-xl border border-white/10">
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenAccordion(open ? null : item.id)}
                      className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm text-white"
                    >
                      {item.title}
                      <ChevronDown
                        className={`h-4 w-4 text-slate-400 transition ${open ? 'rotate-180' : ''}`}
                      />
                    </button>
                    {open ? (
                      <p className="border-t border-white/10 px-3 py-2 text-xs text-slate-400">
                        {item.body}
                      </p>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </LabItem>

          <LabItem title="Modal" className="md:col-span-2 xl:col-span-1">
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Open modal
            </Button>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Lab Modal">
              <p className="text-sm text-slate-300">
                This modal supports Escape, overlay click, focus-friendly close controls and scroll lock.
              </p>
              <Button className="mt-4" variant="primary" onClick={() => setModalOpen(false)}>
                <X className="h-4 w-4" />
                Close
              </Button>
            </Modal>
          </LabItem>
        </div>
      </div>
    </section>
  )
}

function LabItem({
  title,
  children,
  className = '',
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={className} hover>
      <p className="mb-4 text-xs font-semibold tracking-[0.16em] text-slate-400 uppercase">
        {title}
      </p>
      {children}
    </Card>
  )
}
