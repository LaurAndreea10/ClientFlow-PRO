import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTask, deleteTask, getClients, getTasks, updateTask } from '../lib/mockApi'
import type { TaskPriority, TaskStatus } from '../types'

export function TasksPage() {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [clientId, setClientId] = useState<string>('')
  const [priority, setPriority] = useState<TaskPriority>('medium')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [dueDate, setDueDate] = useState('')

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  })

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  })

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setTitle('')
      setDescription('')
      setClientId('')
      setPriority('medium')
      setStatus('todo')
      setDueDate('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, nextStatus }: { id: string; nextStatus: TaskStatus }) =>
      updateTask(id, { status: nextStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const tasksWithClient = useMemo(() => {
    const map = new Map(clients.map((client) => [client.id, client.name]))
    return tasks.map((task) => ({ ...task, clientName: task.clientId ? map.get(task.clientId) ?? 'Unknown client' : 'General' }))
  }, [clients, tasks])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createMutation.mutate({
      title,
      description,
      clientId: clientId || null,
      priority,
      status,
      dueDate,
    })
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <h1 className="page-title">Tasks</h1>
          <p className="muted">Track task status and deadlines without any paid backend.</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card card-pad">
          <h2 style={{ marginTop: 0 }}>Task board</h2>
          <div className="list">
            {tasksWithClient.map((task) => (
              <div key={task.id} className="note">
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                  <div>
                    <strong>{task.title}</strong>
                    <div className="small muted">{task.clientName}</div>
                  </div>
                  <span className="badge">{task.priority}</span>
                </div>
                <p className="small" style={{ marginBottom: 10 }}>{task.description}</p>
                <div className="toolbar">
                  <button className="button secondary" onClick={() => updateMutation.mutate({ id: task.id, nextStatus: 'todo' })}>Todo</button>
                  <button className="button secondary" onClick={() => updateMutation.mutate({ id: task.id, nextStatus: 'in_progress' })}>In progress</button>
                  <button className="button secondary" onClick={() => updateMutation.mutate({ id: task.id, nextStatus: 'done' })}>Done</button>
                  <button className="button danger" onClick={() => deleteMutation.mutate(task.id)}>Delete</button>
                </div>
              </div>
            ))}
            {tasksWithClient.length === 0 ? <div className="muted">No tasks yet.</div> : null}
          </div>
        </div>

        <div className="card card-pad">
          <h2 style={{ marginTop: 0 }}>Create task</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder="Task title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea className="textarea" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
            <select className="select" value={clientId} onChange={(e) => setClientId(e.target.value)}>
              <option value="">General task</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
            <select className="select" value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)}>
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)}>
              <option value="todo">todo</option>
              <option value="in_progress">in progress</option>
              <option value="done">done</option>
            </select>
            <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            <button className="button" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Save task'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}