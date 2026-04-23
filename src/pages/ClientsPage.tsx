import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { createClient, deleteClient, getClients } from '../lib/mockApi'
import type { ClientStatus } from '../types'

export function ClientsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<ClientStatus>('lead')
  const [monthlyValue, setMonthlyValue] = useState('0')

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  })

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      setName('')
      setCompany('')
      setEmail('')
      setPhone('')
      setStatus('lead')
      setMonthlyValue('0')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })

  const filtered = useMemo(() => {
    const term = search.toLowerCase()
    return clients.filter((client) =>
      `${client.name} ${client.company} ${client.email}`.toLowerCase().includes(term),
    )
  }, [clients, search])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    createMutation.mutate({
      name,
      company,
      email,
      phone,
      status,
      monthlyValue: Number(monthlyValue) || 0,
    })
  }

  return (
    <div className="grid">
      <div className="page-header">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="muted">Manage client contacts and monthly value with free local persistence.</p>
        </div>
      </div>

      <div className="two-col">
        <div className="card card-pad">
          <h2 style={{ marginTop: 0 }}>Client list</h2>
          <div className="toolbar" style={{ marginBottom: 16 }}>
            <input
              className="input"
              style={{ maxWidth: 320 }}
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Monthly</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filtered.map((client) => (
                  <tr key={client.id}>
                    <td>
                      <Link to={`/clients/${client.id}`}><strong>{client.name}</strong></Link>
                      <div className="small muted">{client.email}</div>
                    </td>
                    <td>{client.company}</td>
                    <td><span className="badge">{client.status}</span></td>
                    <td>€{client.monthlyValue}</td>
                    <td>
                      <button className="button secondary" onClick={() => deleteMutation.mutate(client.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="muted">No clients found.</td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card card-pad">
          <h2 style={{ marginTop: 0 }}>Add client</h2>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="input" placeholder="Company" value={company} onChange={(e) => setCompany(e.target.value)} required />
            <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className="input" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <select className="select" value={status} onChange={(e) => setStatus(e.target.value as ClientStatus)}>
              <option value="lead">lead</option>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
            <input className="input" placeholder="Monthly value" value={monthlyValue} onChange={(e) => setMonthlyValue(e.target.value)} />
            <button className="button" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Saving...' : 'Save client'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}