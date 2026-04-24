import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const TOUR_KEY = 'clientflow_demo_tour_seen'

const steps = [
  {
    title: 'Welcome to ClientFlow PRO',
    body: 'This demo shows a local-first SaaS-style CRM with clients, tasks, analytics, calendar, activity and settings.',
    route: '/dashboard',
  },
  {
    title: 'Client pipeline',
    body: 'Review pinned accounts, health score, tags, archive and custom CRM fields.',
    route: '/clients',
  },
  {
    title: 'Advanced task workflow',
    body: 'Use Kanban, saved views, recurring tasks, subtasks, comments and archive/restore.',
    route: '/tasks',
  },
  {
    title: 'Reports and exports',
    body: 'Explore charts, CSV export, JSON export and print/PDF-ready reports.',
    route: '/reports',
  },
]

export function DemoTour() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const seen = localStorage.getItem(TOUR_KEY)
    if (!seen) {
      const timer = window.setTimeout(() => setOpen(true), 700)
      return () => window.clearTimeout(timer)
    }
  }, [])

  function startTour() {
    setStep(0)
    setOpen(true)
    navigate(steps[0].route)
  }

  function closeTour() {
    localStorage.setItem(TOUR_KEY, 'true')
    setOpen(false)
  }

  function nextStep() {
    const next = step + 1
    if (next >= steps.length) {
      closeTour()
      return
    }
    setStep(next)
    if (location.pathname !== steps[next].route) navigate(steps[next].route)
  }

  return (
    <>
      <button className="button secondary" type="button" onClick={startTour}>Demo tour</button>
      {open ? (
        <>
          <div className="tour-backdrop" onClick={closeTour} />
          <section className="tour-card" role="dialog" aria-modal="true" aria-label="Demo tour">
            <div className="pill">Step {step + 1} of {steps.length}</div>
            <h2 style={{ marginBottom: 8 }}>{steps[step].title}</h2>
            <p className="muted">{steps[step].body}</p>
            <div className="tour-progress" aria-hidden="true">
              {steps.map((item, index) => <span key={item.title} className={index <= step ? 'active' : ''} />)}
            </div>
            <div className="toolbar" style={{ marginTop: 18 }}>
              <button className="button secondary" type="button" onClick={closeTour}>Skip</button>
              <button className="button" type="button" onClick={nextStep}>{step === steps.length - 1 ? 'Finish' : 'Next'}</button>
            </div>
          </section>
        </>
      ) : null}
    </>
  )
}
