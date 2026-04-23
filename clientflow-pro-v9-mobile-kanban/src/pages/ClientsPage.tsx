import { FormEvent, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { createClient, deleteClient, getClients, updateClient } from '../lib/mockApi'
import type { Client, ClientStatus } from '../types'

const defaultForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  status: 'lead' as ClientStatus,
  monthlyValue: '0',
}

export function ClientsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | ClientStatus>('all')
  const [form, setForm] = useState(defaultForm)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
  })

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['clients'] })
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
    queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  }

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      refresh()
      setForm(defaultForm)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Client> }) => updateClient(id, payload),
    onSuccess: () => {
      refresh()
      setEditingId(null)
      setForm(defaultForm)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: refresh,
  })

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    return clients.filter((client) => {
      const matchesSearch = `${client.name} ${client.company} ${client.email}`.toLowerCase().includes(term)
      const matchesStatus = filterStatus === 'all' || client.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [clients, search, filterStatus])

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const payload = {
      name: form.name,
      company: form.company,
      email: form.email,
      phone: form.phone,
      status: form.status,
      monthlyValue: Number(form.monthlyValue) || 0,
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload })
      return
    }

    createMutation.mutate(payload)
  }

  function startEdit(client: Client) {
    setEditingId(client.id)
    setForm({
      name: client.name,
      company: client.company,
      email: client.email,
      phone: client.phone,
      status: client.status,
      monthlyValue: String(client.monthlyValue),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditingId(null)
    setForm(defaultForm)
  }

  return (
    <div className="grid page-gap-lg">
      <div className="page-header stack-on-mobile">
        <div>
          <p className="eyebrow">Client management</p>
          <h1 className="page-title">Clients</h1>
          <p className="muted">Organize leads, active accounts and monthly retainers from one focused mobile-first view.</p>
        </div>
        <div className="page-header-actions mobile-full">
          <div className="pill">👥 {clients.length} total</div>
          <div className="pill">💸 €{clients.reduce((sum, item) => sum + item.monthlyValue, 0)}</div>
        </div>
      </div>

      <div className="two-col two-col-equal mobile-reverse">
        <div className="card card-pad sticky-card-mobile">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>{editingId ? 'Edit client' : 'Add client'}</h2>
              <div className="small muted">{editingId ? 'Update an existing client card.' : 'Create a new contact card in seconds.'}</div>
            </div>
            {editingId ? (
              <button className="button secondary" type="button" onClick={resetForm}>Cancel</button>
            ) : null}
          </div>
          <form className="form-grid" onSubmit={handleSubmit}>
            <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
            <input className="input" placeholder="Company" value={form.company} onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))} required />
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
            <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
            <select className="select" value={form.status} onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as ClientStatus }))}>
              <option value="lead">lead</option>
              <option value="active">active</option>
              <option value="inactive">inactive</option>
            </select>
            <input className="input" type="number" min="0" placeholder="Monthly value" value={form.monthlyValue} onChange={(e) => setForm((prev) => ({ ...prev, monthlyValue: e.target.value }))} />
            <button className="button" disabled={createMutation.isPending || updateMutation.isPending}>
              {editingId ? 'Save changes' : createMutation.isPending ? 'Saving...' : 'Add client'}
            </button>
          </form>
        </div>

        <div className="card card-pad">
          <div className="card-title-row stack-on-mobile">
            <div>
              <h2 style={{ margin: 0 }}>Client list</h2>
              <div className="small muted">Search, filter and edit your current pipeline.</div>
            </div>
            <div className="pill">✨ recruiter-ready</div>
          </div>

          <div className="toolbar toolbar-stack-mobile" style={{ marginBottom: 16 }}>
            <input
              className="input"
              placeholder="Search clients, companies or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="select compact-control" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as 'all' | ClientStatus)}>
              <option value="all">All statuses</option>
              <option value="lead">Lead</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="mobile-card-list">
            {filtered.map((client) => (
              <article key={client.id} className="mobile-list-card">
                <div className="mobile-list-row">
                  <div>
                    <Link to={`/clients/${client.id}`}><strong>{client.name}</strong></Link>
                    <div className="small muted">{client.company}</div>
                  </div>
                  <span className={`badge ${client.status}`}>{client.status}</span>
                </div>
                <div className="small muted" style={{ marginTop: 8 }}>{client.email}</div>
                <div className="mobile-list-row" style={{ marginTop: 12 }}>
                  <span className="pill small-pill">€{client.monthlyValue}/mo</span>
                  <div className="toolbar compact-toolbar">
                    <button className="button secondary" onClick={() => startEdit(client)}>Edit</button>
                    <button className="button danger" onClick={() => deleteMutation.mutate(client.id)}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
            {filtered.length === 0 ? (
              <div className="empty-state premium-empty-state">
                <div className="empty-icon">🔎</div>
                <strong>No clients match your filters.</strong>
                <div className="small muted">Try another status, clear search, or add your first client from the form.</div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
