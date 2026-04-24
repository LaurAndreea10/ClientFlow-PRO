import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { getClients, getTasks } from '../lib/mockApi'

type Command = {
  id: string
  title: string
  description: string
  group: string
  action: () => void
}

export function CommandPalette() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { data: clients = [] } = useQuery({ queryKey: ['clients'], queryFn: getClients })
  const { data: tasks = [] } = useQuery({ queryKey: ['tasks'], queryFn: getTasks })

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const isCommandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k'
      if (isCommandK) {
        event.preventDefault()
        setOpen((current) => !current)
      }

      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const commands = useMemo<Command[]>(() => {
    const navigation: Command[] = [
      { id: 'nav-dashboard', title: 'Open dashboard', description: 'Go to portfolio overview', group: 'Navigation', action: () => navigate('/dashboard') },
      { id: 'nav-clients', title: 'Open clients', description: 'Manage client pipeline', group: 'Navigation', action: () => navigate('/clients') },
      { id: 'nav-tasks', title: 'Open tasks', description: 'Review workload and Kanban flow', group: 'Navigation', action: () => navigate('/tasks') },
      { id: 'nav-reports', title: 'Open reports', description: 'View analytics and exports', group: 'Navigation', action: () => navigate('/reports') },
      { id: 'nav-calendar', title: 'Open calendar', description: 'Review due dates and timeline', group: 'Navigation', action: () => navigate('/calendar') },
      { id: 'nav-settings', title: 'Open settings', description: 'Update local preferences', group: 'Navigation', action: () => navigate('/settings') },
    ]

    const clientCommands = clients.slice(0, 8).map<Command>((client) => ({
      id: `client-${client.id}`,
      title: client.name,
      description: `${client.company} · ${client.status} · €${client.monthlyValue}/month`,
      group: 'Clients',
      action: () => navigate(`/clients/${client.id}`),
    }))

    const taskCommands = tasks.slice(0, 8).map<Command>((task) => ({
      id: `task-${task.id}`,
      title: task.title,
      description: `${task.status.replace('_', ' ')} · ${task.priority} priority`,
      group: 'Tasks',
      action: () => navigate('/tasks'),
    }))

    return [...navigation, ...clientCommands, ...taskCommands]
  }, [clients, navigate, tasks])

  const filtered = commands.filter((command) => {
    const term = query.toLowerCase().trim()
    return `${command.title} ${command.description} ${command.group}`.toLowerCase().includes(term)
  })

  function runCommand(command: Command) {
    command.action()
    setOpen(false)
    setQuery('')
  }

  if (!open) {
    return (
      <button className="button secondary command-trigger" onClick={() => setOpen(true)} type="button">
        <span>Search</span>
        <kbd>⌘K</kbd>
      </button>
    )
  }

  return (
    <>
      <button className="button secondary command-trigger" onClick={() => setOpen(true)} type="button">
        <span>Search</span>
        <kbd>⌘K</kbd>
      </button>
      <div className="command-backdrop" onClick={() => setOpen(false)} />
      <section className="command-palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="command-input-wrap">
          <span className="muted">⌘K</span>
          <input
            className="command-input"
            autoFocus
            placeholder="Search clients, tasks or pages..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button className="text-button" onClick={() => setOpen(false)} type="button">Esc</button>
        </div>
        <div className="command-results">
          {filtered.map((command) => (
            <button className="command-item" key={command.id} onClick={() => runCommand(command)} type="button">
              <span>
                <strong>{command.title}</strong>
                <span className="small muted">{command.description}</span>
              </span>
              <span className="badge">{command.group}</span>
            </button>
          ))}
          {filtered.length === 0 ? <div className="empty-state">No commands found.</div> : null}
        </div>
      </section>
    </>
  )
}
